import { useMemo, useCallback, useState, useEffect, AnimationEvent } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdInfo, MdCheckCircle, MdWarning, MdError } from 'react-icons/md';
import styled from 'styled-components';
import { useToasts, ToastType, type Toast } from '../../store/toasts';

export function Toasts() {
    const refMap = useMemo(() => new WeakMap<Toast, HTMLDivElement>(), []);
    const toastsState = useToasts();
    const [visibleToasts, setVisibleToasts] = useState(toastsState.toasts);

    // fade out animation
    useEffect(() => {
        if (toastsState.toasts.length >= visibleToasts.length) {
            setVisibleToasts(toastsState.toasts);
        }

        visibleToasts.forEach(item => {
            if (!toastsState.toasts.includes(item)) {
                refMap.get(item)?.classList.add('fade-out');
            }
        });
    }, [toastsState.toasts]);

    // lifetime animation
    useEffect(() => {
        visibleToasts.forEach(toast => {
            if (refMap.has(toast)) {
                const el = refMap.get(toast);
                const life = el?.querySelector('.life');

                if (life instanceof HTMLElement && !life.hasAttribute('style')) {
                    life.style.animationDuration = `${100 + toast.message.trim().length * 125}ms`;
                }
            }
        });
    }, [visibleToasts]);

    const getIcon = useCallback((type: ToastType) => {
        switch (type) {
            case ToastType.INFO:
                return <MdInfo />;
            case ToastType.SUCCESS:
                return <MdCheckCircle />;
            case ToastType.WARNING:
                return <MdWarning />;
            case ToastType.ERROR:
                return <MdError />;
        }
    }, []);

    const handleFadeOut = (itemId: number) => (event: AnimationEvent) => {
        if (event.animationName.includes('fade-out')) {
            setVisibleToasts(toastsState.toasts.filter(t => t.id !== itemId));
        }
    };

    const handleEndOfLife = (itemId: number) => () => {
        toastsState.api.closeToast(itemId);
    };

    return visibleToasts.length === 0 ? null : (
        <Wrapper>
            {visibleToasts.map(item => (
                <StyledToast
                    key={item.id}
                    $type={item.type}
                    ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
                    onAnimationEnd={handleFadeOut(item.id)}
                >
                    <Content>
                        <Icon>{getIcon(item.type)}</Icon>
                        <Text>{item.message}</Text>
                        <Close
                            onClick={e => {
                                e.stopPropagation();
                                toastsState.api.closeToast(item.id);
                            }}
                        >
                            <IoMdClose />
                        </Close>
                    </Content>
                    <Life className="life" onAnimationEnd={handleEndOfLife(item.id)} />
                </StyledToast>
            ))}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: fixed;
    overflow: hidden;
    inset: 0;
    padding: 20px;
    pointer-events: none;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    z-index: 200;
`;

const StyledToast = styled.div<{ $type: ToastType }>`
    display: flex;
    position: relative;
    pointer-events: all;
    max-height: 100px;
    max-width: 500px;
    margin-bottom: var(--spacing-large);

    background-color: var(--bgColor-default);
    border: 1px solid var(--borderColor-default);
    border-radius: var(--borderRadius-default);

    @keyframes toast-fade-in {
        0% {
            margin-bottom: 0px;
            opacity: 0;
            max-height: 0px;
            transform: translateY(-45%);
        }
        25% {
            opacity: 0;
        }
        75% {
            max-height: 100px;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes toast-fade-out {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
            transform: translateY(25%);
        }
        100% {
            opacity: 0;
            max-height: 0px;
            margin-bottom: 0px;
        }
    }

    &.fade-out {
        animation: toast-fade-out 400ms ease-out forwards;
    }

    animation: toast-fade-in 400ms forwards;

    ${({ $type }) => {
        let color = '#ccc';

        switch ($type) {
            case ToastType.INFO:
                color = '#4f99b8';
                break;
            case ToastType.SUCCESS:
                color = '#238d27';
                break;
            case ToastType.WARNING:
                color = '#a1a527';
                break;
            case ToastType.ERROR:
                color = '#a52727';
                break;
        }

        return `
    svg {
      fill: ${color};
    }
  `;
    }}
`;

const Icon = styled.span`
    display: flex;
    font-size: 16px;
    color: #238d27;
    padding-right: var(--spacing-large);
`;

const Text = styled.p`
    white-space: pre-wrap;
    word-break: break-word;
    flex: 1;
`

const Content = styled.div`
    position: relative;
    padding: var(--spacing-large);
    border-radius: var(--borderRadius-default);
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: space-between;

    @keyframes blur-in {
        0% {
            backdrop-filter: blur(0px);
        }
        100% {
            backdrop-filter: blur(10px);
        }
    }
    animation-name: blur-in;
    animation-duration: 6s;
    animation-fill-mode: forwards;
`;

const Close = styled.span`
    display: flex;
    align-items: center;
    font-size: 16px;
    padding-left: 20px;
    transition: var(--transition-default);

    svg {
        fill: var(--fgColor-default);
    }

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
`;

const Life = styled.div`
    position: absolute;
    bottom: 0;
    left: 0px;
    height: 6px;
    width: 0%;
    background-color: var(--borderColor-default);
    opacity: 0.25;

    @keyframes toast-lifetime {
        100% {
            width: 100%;
        }
    }

    animation-name: toast-lifetime;
    animation-delay: 250ms;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    pointer-events: none;
`;
