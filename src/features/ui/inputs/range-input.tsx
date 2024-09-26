import { forwardRef, CSSProperties, ChangeEvent, RefObject } from 'react'
import { NumberInput } from './number-input'
import styled, { css } from 'styled-components'
import { invlerp } from '../../../helpers'

type Props = {
  value: number
  step?: number
  min?: number
  max?: number
  style?: CSSProperties
  numberInput?: boolean
  numberInputRef?: RefObject<HTMLInputElement>
  numberInputStyle?: CSSProperties
  numberInputAlign?: CanvasTextAlign
  onRangeChange?: (value: number) => void
  onRangeChangeEnd: (value: number) => void
  onInputChange?: (value: number) => void
}; 

export const RangeInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { value, step = 0.01, min = 0, max = 100, style, numberInput, numberInputRef, numberInputStyle, numberInputAlign, onRangeChange, onRangeChangeEnd, onInputChange } = props;
  const percentage = invlerp(min, max, value) * 100;

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>) {
    if (onRangeChange) {
      const value = Number(event.target.value);
      onRangeChange(value);
    }
  }

  function handleRangeChangeEnd() {
    if (onRangeChangeEnd) {
      onRangeChangeEnd(value);
    }
  } 

  return (
    <>
      <Wrapper style={style}>
        <Slider
          ref={ref}
          type='range'
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={handleRangeChange}
          onPointerUp={handleRangeChangeEnd}
          style={{
            background: `linear-gradient(to right, var(--color-blue-5) ${percentage}%, transparent ${percentage}%)`
          }}
        />
      </Wrapper>
      {numberInput && (
        <NumberInput
          ref={numberInputRef}
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={onInputChange}
          style={numberInputStyle}
          align={numberInputAlign}
        />
      )}
    </>
  )
});


const Wrapper = styled.div`
  position: relative;
  height: 7px;
  background-color:var(--control-default-bgColor-rest);
  box-shadow: inset 0 0 0 1px var(--borderColor-default);
  border-radius: 20px;
`

const thumb = css`
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  background: var(--color-blue-4);
  border-radius: 100%;
  transition: var(--transition-default);

  &:hover {
    background: var(--color-blue-6);
  }
`
const Slider = styled.input`
position: absolute;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 7px;
  outline: none;
  background: var(--control-default-bgColor-rest);
  border-radius: 3px;

  &::-webkit-slider-thumb {
    ${thumb}
  }

  &::-moz-range-thumb {
    ${thumb};
    border: none;
  }
`


