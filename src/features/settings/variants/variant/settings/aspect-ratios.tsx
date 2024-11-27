import styled from 'styled-components';
import { Button } from '../../../../ui/inputs/button';
import { Bold } from './styled';
import { MdArrowLeft, MdArrowRight, MdCheck } from 'react-icons/md';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { BsFillAspectRatioFill } from 'react-icons/bs';
import { ButtonGroup } from '../../../../ui/inputs/styled';
import { TextInput } from '../../../../ui/inputs/text-input';
import { useOutsideClick } from '../../../../../hooks';
import { useVariants } from '../../../../../store/variants';
import { Variant } from '../../../../../store/types';
import { openToast, ToastType } from '../../../../../store/toasts';
import { aspectRatioIsHorizontal, isValidAspectRatio, presetAspectRatios } from './utils';
import { useDidUpdateEffect } from '../../../../../hooks/use-did-update-effect';
import { Tooltip } from '../../../../ui/tooltip';

export function AspectRatios({ variant }: { variant: Variant }) {
    const [currentPreset, setCurrentPreset] = useState(0);
    const [horizontal, setHorizontal] = useState(
        aspectRatioIsHorizontal(variant.aspectRatio.value)
    );
    const [inputText, setInputText] = useState(variant.aspectRatio.value);
    const [editing, setEditing] = useState(false);
    const editingRef = useRef(editing);
    editingRef.current = editing;
    const textInputRef = useRef<HTMLInputElement>(null!);
    const buttonGroupRef = useRef<HTMLDivElement>(null!);
    const actuatorRef = useRef<HTMLButtonElement>(null!);
    const api = useVariants(state => state.api);
    const handleFocus = useRef(false);

    useOutsideClick(buttonGroupRef, () => {
        if (editingRef.current) {
            checkInput();
        }
    });

    useDidUpdateEffect(() => {
        if (editing) {
            textInputRef.current.focus();
        } else {
            if (handleFocus.current) {
                handleFocus.current = false;
                actuatorRef.current.focus();
            }
        }
    }, [editing]);

    useEffect(() => {
        setInputText(variant.aspectRatio.value);
    }, [variant]);

    function checkInput() {
        if (isValidAspectRatio(inputText)) {
            setHorizontal(aspectRatioIsHorizontal(inputText));
            api.setAspectRatioValue(variant.id, inputText);
        } else {
            openToast(ToastType.ERROR, 'Invalid aspect ratio format. Please try again.');
            setInputText(variant.aspectRatio.value);
        }

        setEditing(false);
    }

    function handleLeft() {
        let newIndex = 0;

        if (currentPreset === 0) {
            newIndex = presetAspectRatios.length - 1;
        } else {
            newIndex = currentPreset - 1;
        }

        setCurrentPreset(newIndex);
        api.setAspectRatioValue(
            variant.id,
            horizontal ? presetAspectRatios[newIndex][0] : presetAspectRatios[newIndex][1]
        );
    }

    function handleRight() {
        const newIndex = (currentPreset + 1) % presetAspectRatios.length;

        setCurrentPreset(newIndex);
        api.setAspectRatioValue(
            variant.id,
            horizontal ? presetAspectRatios[newIndex][0] : presetAspectRatios[newIndex][1]
        );
    }

    function handleKey(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                handleFocus.current = true;
                checkInput();
        }
    }

    function handleFlip() {
        setHorizontal(v => !v);
        api.flipAspectRatio(variant.id);
    }

    return (
        <>
            <Bold>Aspect ratio</Bold>
            <Wrapper>
                <Button onClick={handleLeft} style={{ paddingInline: 0, minWidth: 30 }}>
                    <MdArrowLeft size={20} />
                </Button>
                <ButtonGroup ref={buttonGroupRef} style={{ width: '100%' }}>
                    {editing ? (
                        <>
                            <TextInput
                                ref={textInputRef}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={handleKey}
                                align="center"
                            />
                            <Button
                                onClick={() => setEditing(false)}
                                style={{ paddingInline: 0, minWidth: 30 }}
                            >
                                <MdCheck size={20} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Tooltip
                                content={
                                    <Tooltip.Content>
                                        Enable aspect ratio{'\n'}(double click to edit)
                                    </Tooltip.Content>
                                }
                            >
                                <Button
                                    ref={actuatorRef}
                                    active={variant.aspectRatio.enabled}
                                    onClick={() => api.toggleAspectRatioEnabled(variant.id)}
                                    onDoubleClick={() => setEditing(true)}
                                    style={{ width: '100%' }}
                                >
                                    {variant.aspectRatio.value}
                                </Button>
                            </Tooltip>
                            <Tooltip content={<Tooltip.Content>Flip aspect ratio</Tooltip.Content>}>
                                <Button
                                    onClick={handleFlip}
                                    style={{ paddingInline: 0, minWidth: 30 }}
                                >
                                    <BsFillAspectRatioFill
                                        style={{
                                            ...(!horizontal && {
                                                transform: 'rotate(90deg) scaleX(-1)',
                                            }),
                                        }}
                                        size={16}
                                    />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </ButtonGroup>
                <Button onClick={handleRight} style={{ paddingInline: 0, minWidth: 30 }}>
                    <MdArrowRight size={20} />
                </Button>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
    display: flex;
    gap: 5px;
`;
