import { useState, forwardRef, FocusEvent, KeyboardEvent, CSSProperties, useEffect, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { outlineRest, outlineActive } from '../../../styles/mixins'
import { clamp, countDecimals } from '../../../helpers'

type Props = {
  label?: string
  value: string | number
  step?: number
  min?: number
  max?: number
  align?: CanvasTextAlign
  onChange?: (value: number) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  style?: CSSProperties
  placeholder?: string
  spellCheck?: boolean
}; 

export const NumberInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, value, step = 0.001, min = -Infinity, max = Infinity, align, onChange, onBlur, style, placeholder, spellCheck } = props;
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const stepDecimals = countDecimals(step.toString());
  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    const valueDecimals = countDecimals(typeof value === 'string' ? value : value.toString());
    setInternalValue(Number(value).toFixed(Math.min(valueDecimals, stepDecimals)));
  }, [stepDecimals, value]);

  function toggleError() {
    inputRef.current.classList.remove('error');
    setTimeout(() => {
      inputRef.current.classList.add('error');
    }, 50);
  }

  function checkBounds(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;

    
    const regex = /(?<=^|)\d+(\.\d+)?(?=$| )/
    if (!regex.test(target.value)) {
      setInternalValue(target.value);
      return;
    }
    
    const numberValue = Number(target.value);

    if (Number.isNaN(numberValue)) return;
    if (numberValue < min || numberValue > max) toggleError();
    
    const clamped = clamp(Number(numberValue), min, max)
    const valueDecimals = countDecimals(target.value);
    const rounded = clamped.toFixed(Math.min(stepDecimals, valueDecimals));
    
    setInternalValue(rounded);
    onChange?.(Number(rounded));
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    let numValue = Number(internalValue);
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (numValue === max) {
          toggleError();
          return;
        }
        
        numValue = Math.min(Number(value) + step, max);
        break;
        case 'ArrowDown':
        event.preventDefault();
        if (numValue === min) {
          toggleError();
          return;
        }

        numValue = Math.max(Number(value) - step, min);
        break;
      default: return;
    }


    numValue = Number(numValue.toFixed(stepDecimals));

    setInternalValue(numValue.toString());
    onChange?.(numValue);
  }


  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(event);
  }

  return (
    <TextInputWrapper style={style}>
      {label && <TextInputLabel htmlFor={label}>{label}:</TextInputLabel>}
      <TextInputContainer ref={inputRef} $focused={isFocused}>
        <Input
          ref={ref}
          name={label}
          type='text'
          value={internalValue}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onChange={checkBounds}
          onKeyDown={handleKey}
          onBlur={handleBlur}
          spellCheck={spellCheck}
          style={{
            ...(align) && { textAlign: align }
          }}
          >
        </Input>
      </TextInputContainer>
    </TextInputWrapper>
  )
});

const TextInputWrapper = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;
gap: 5px;
white-space: nowrap;
width: 100%;
`

const TextInputLabel = styled.label`
font-weight: 600;
`

const TextInputContainer = styled.div<{ $focused: boolean }>`
${outlineRest}
${props => props.$focused && outlineActive}
background-color: var(--control-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
transition: border-color var(--transition-default);
overflow: hidden;
padding: 0 6px;

display: flex;
align-items: center;
gap: 4px;

@keyframes error {
  0% {
    background-color: var(--control-default-bgColor-error);
  }
  100% {
    background-color: var(--control-default-bgColor-rest);
  }
}
&.error {
  background-color: red;
  animation-name: error;
  animation-duration: var(--transition-slow);
  animation-fill-mode: forwards;
}
`

const Input = styled.input`
font-weight: 400;
width: 100%;
height: 27px;
outline: none;
border: none;
background-color: transparent;
`