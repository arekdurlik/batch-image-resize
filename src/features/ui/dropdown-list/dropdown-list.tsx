import {
    createContext,
    Dispatch,
    MouseEvent,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { OVERLAY_ID } from '../../../lib/constants';
import { Placement } from '../types';
import { Container } from './styled';
import { Item } from './children/item';
import { Props, RenderParams } from './types';
import { getAlignment } from './utils';
import { Divider } from './children/divider';

export type DropdownContextType = {
    items: HTMLElement[];
};

export type DropdownContextValueType = [
    DropdownContextType,
    {
        set: Dispatch<SetStateAction<DropdownContextType>>;
        close: () => void;
    }
];

const DropdownContext = createContext<DropdownContextValueType>(null!);
export const useDropdownContext = () => useContext(DropdownContext);

export function DropdownList({
    children,
    actuator,
    floating = false,
    align = 'left',
    slideIn = false,
    margin = 4,
    onClose,
}: Props) {
    const [state, setState] = useState<DropdownContextType>({
        items: [],
    });
    const [renderParams, setRenderParams] = useState<RenderParams>({
        x: 0,
        y: 0,
        placement: Placement.BOTTOM,
        width: 'auto',
    });
    const overlay = useRef<HTMLDivElement>(document.querySelector(`#${OVERLAY_ID}`)!);
    const list = useRef<HTMLUListElement>(null!);

    useEffect(() => {
        state.items[0]?.focus();
    }, [state.items]);
    // click away listener
    // pointer down with useCapture, otherwise clicking on panel resizer doesn't close dropdown
    useEffect(() => {
        function handler(event: MouseEvent) {
            event.stopPropagation();
            const clickedOnActuator = actuator?.current?.contains(event.target as HTMLElement);
            const clickedOnList = event.target === list.current;
            const clickedOnOption = list.current.contains(event.target as HTMLElement);

            if (!clickedOnActuator && !clickedOnOption && !clickedOnList) {
                handleClose();
            }
        }

        document.addEventListener('pointerdown', handler, true);
        return () => document.removeEventListener('pointerdown', handler, true);
    }, [actuator]);

    // set list placement based on screen bounds
    useEffect(() => {
        function calculatePosition() {
            if (!list.current || !actuator?.current) return;

            const listRect = list.current.getBoundingClientRect();
            const actuatorRect = actuator.current.getBoundingClientRect();
            const alignment = getAlignment(listRect, actuatorRect, align);
            const actuatorBottom = actuatorRect.y + actuatorRect.height;

            let width: string | number = 'auto';

            if (actuatorRect.width > listRect.width) {
                width = actuatorRect.width;
            }
            if (actuatorBottom + listRect.height > window.innerHeight) {
                setRenderParams({
                    x: actuatorRect.x + alignment,
                    y: actuatorRect.y - listRect.height - margin,
                    placement: Placement.TOP,
                    width,
                });
            } else {
                setRenderParams({
                    x: actuatorRect.x + alignment,
                    y: actuatorRect.y + actuatorRect.height + margin,
                    placement: Placement.BOTTOM,
                    width,
                });
            }
        }

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        return () => window.removeEventListener('resize', calculatePosition);
    }, [actuator, align, margin]);

    function handleClose() {
        onClose?.();
    }

    function stopPropagation(event: MouseEvent) {
        event.stopPropagation();
    }

    return createPortal(
        <DropdownContext.Provider value={[state, { set: setState, close: handleClose }]}>
            <Container
                ref={list}
                $floating={floating}
                $slideIn={slideIn}
                $renderParams={renderParams}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
            >
                {children}
            </Container>
        </DropdownContext.Provider>,

        overlay.current
    );
}

DropdownList.Item = Item;
DropdownList.Divider = Divider;
