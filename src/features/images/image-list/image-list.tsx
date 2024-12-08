import { useState, useMemo, useRef, useEffect } from 'react';
import { clamp } from '../../../lib/helpers';
import { useApp } from '../../../store/app';
import { ImageData, SelectedItem } from '../../../store/types';
import { SortOption } from '../types';
import { ImageListWrapper, Grid } from './styled';
import { allToSelectedItems, toSelectedItems, jumpToElement } from './utils';
import {
    useMouseInputRef,
    useModifiersRef,
    useDragSelect,
    useForceUpdate,
    useOutsideClick,
    useKeyDownEvents,
} from '../../../hooks';
import { Item } from './item';

const INPUT_TIMEOUT = 500;

type Props = {
    type: 'input' | 'output';
    images: ImageData[];
    sortBy?: SortOption;
};

export function ImageList({ type, images, sortBy = SortOption.FILENAME }: Props) {
    const [isActive, setIsActive] = useState(false);
    const itemRefMap = useMemo(() => new Map<string, HTMLDivElement>(), []);

    const grid = useRef<HTMLDivElement>(null!);
    const wrapper = useRef<HTMLDivElement>(null!);
    const selected = useRef<SelectedItem[]>([]);
    const latestSelectedItem = useRef<SelectedItem>();
    const inputtingTimeout = useRef<NodeJS.Timeout>();
    const input = useRef('');

    const api = useApp(state => state.api);
    const mouse = useMouseInputRef();
    const modifiers = useModifiersRef();

    const selectables = Array.from(itemRefMap).map(i => i[1]);
    const dragSelectBind = useDragSelect(
        wrapper,
        selectables,
        {
            onStart: data => {
                setIsActive(true);

                if (data) {
                    const item = toSelectedItems([data], type)[0];

                    if (modifiers.shift) {
                        api.selectItemWithShift(
                            item,
                            images.map(({ id }) => ({ type, id }))
                        );
                    } else {
                        api.selectItems([item], modifiers);
                    }
                }
            },
            onChange: data => {
                const i = allToSelectedItems(data, type);
                api.selectItemsByDrag(i.selected, i.added, i.removed, modifiers);
            },
            onEnd: (_, dragged, target) => {
                if (!dragged && target === wrapper.current) {
                    api.setSelectedItems([], !selected.current.length);
                }
            },
        },
        { ignoreChildren: true }
    );

    useForceUpdate([images.length]); // fixes drag selecting before images are loaded in
    useOutsideClick(wrapper, handleBlur, { cancelOnDrag: true });

    // jump to new active item if out of view
    useEffect(() => {
        const unsub1 = useApp.subscribe(
            state => state.selectedItems,
            items => {
                selected.current = items;
            }
        );

        const unsub2 = useApp.subscribe(
            state => state.latestSelectedItem,
            item => {
                latestSelectedItem.current = item;

                if (!mouse.lmb && item) {
                    const el = itemRefMap.get(item.id);
                    el && jumpToElement(wrapper.current, el);
                }
            }
        );

        return () => {
            unsub1();
            unsub2();
        };
    }, [itemRefMap, mouse]);

    useKeyDownEvents(
        event => {
            const lastItem = latestSelectedItem.current?.id;
            const activeId = latestSelectedItem.current?.id ?? 0;

            const index = Math.max(
                0,
                images.findIndex(img => img.id === activeId)
            );
            let newIndex = index;

            switch (event.key) {
                case 'a':
                case 'A': {
                    if (modifiers.control) {
                        event.preventDefault();
                        const items = toSelectedItems(selectables, type);
                        api.setSelectedItems(items);
                    }
                    return;
                }
                case 'ArrowLeft':
                case 'ArrowRight': {
                    newIndex = event.key === 'ArrowLeft' ? newIndex - 1 : newIndex + 1;
                    newIndex = clamp(newIndex, 0, images.length - 1);

                    break;
                }
                case 'ArrowUp':
                case 'ArrowDown': {
                    event.preventDefault();

                    const columnCount = window
                        .getComputedStyle(grid.current)
                        .getPropertyValue('grid-template-columns')
                        .split(' ').length;

                    newIndex =
                        event.key === 'ArrowUp' ? newIndex - columnCount : newIndex + columnCount;

                    if (newIndex < 0 || newIndex > images.length - 1) {
                        newIndex = index;
                    }

                    break;
                }
                default: {
                    if (event.key === ' ') {
                        if (input.current.length) {
                            event.preventDefault();
                            event.stopPropagation();
                        } else {
                            return;
                        }
                    }

                    handleInput(event.key);
                    return;
                }
            }

            if (newIndex === index && lastItem !== undefined) return;

            api.setSelectedItems([{ type, id: images[newIndex].id }], true);
        },
        isActive && images.length > 0,
        [images, selected]
    );

    function handleInput(key: string) {
        if (key.length !== 1) return;

        input.current += key.toLowerCase();

        clearTimeout(inputtingTimeout.current);
        inputtingTimeout.current = setTimeout(() => {
            input.current = '';
        }, INPUT_TIMEOUT);

        const found = images.find(img => img.filename.toLowerCase().startsWith(input.current));
        found && api.setSelectedItems([{ type, id: found.id }], true);
    }

    function handleKeyboardFocus() {
        if (!modifiers.tab || !images.length) return;

        setIsActive(true);

        const index = images.findIndex(img => img.id === latestSelectedItem.current?.id);

        index >= 0 && latestSelectedItem.current?.type === type
            ? api.setSelectedItems([{ type, id: images[index].id }], true)
            : api.setSelectedItems([{ type, id: images[0].id }], true);
    }

    function handleKeyboardBlur() {
        if (!modifiers.tab) return;
        handleBlur();
    }

    function handleBlur() {
        if (!isActive || mouse.rmb) return;
        setIsActive(false);
        latestSelectedItem.current = selected.current[selected.current.length - 1];
    }

    function handleMouseDown(id: string) {
        return () => {
            if (modifiers.shift) {
                api.selectItemWithShift(
                    { type, id },
                    images.map(({ id }) => ({ type, id }))
                );
            } else if (modifiers.control) {
                api.selectItems([{ type, id }], modifiers);
            } else {
                if (!selected.current.map(i => i.id).includes(id)) {
                    api.selectItems([{ type, id }], modifiers);
                }
            }
        };
    }

    function handleClick(id: string) {
        return () => {
            if (modifiers.none) {
                api.setSelectedItems([{ type, id }], true);
            }
        };
    }

    return (
        <ImageListWrapper
            ref={wrapper}
            $focused={isActive}
            tabIndex={0}
            onFocus={handleKeyboardFocus}
            onBlur={handleKeyboardBlur}
            onContextMenu={() => setIsActive(true)}
            {...dragSelectBind}
        >
            {images.length > 0 && (
                <Grid ref={grid}>
                    {images.map((image, index) => (
                        <Item
                            ref={node =>
                                node ? itemRefMap.set(image.id, node) : itemRefMap.delete(image.id)
                            }
                            key={image.id}
                            index={index}
                            type={type}
                            image={image}
                            sortBy={sortBy}
                            listFocused={isActive}
                            onMouseDown={handleMouseDown(image.id)}
                            onClick={handleClick(image.id)}
                            toFocusOnClose={wrapper}
                        />
                    ))}
                </Grid>
            )}
        </ImageListWrapper>
    );
}
