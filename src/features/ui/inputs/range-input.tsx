import { forwardRef, CSSProperties, ChangeEvent, RefObject, FocusEvent, PointerEvent } from 'react'
import { NumberInput } from './number-input'

type Props = {
  value: number
  step?: number
  min?: number
  max?: number
  style?: CSSProperties
  numberInput?: boolean
  numberInputRef?: RefObject<HTMLInputElement>
  numberInputStyle?: CSSProperties
  onRangeChange?: (value: number) => void
  onRangeChangeEnd: (event: PointerEvent<HTMLInputElement>, value: number) => void
  onInputChange?: (value: number) => void
}; 

export const RangeInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { value, step = 0.01, min = 0, max = 100, style, numberInput, numberInputRef, numberInputStyle, onRangeChange, onRangeChangeEnd, onInputChange } = props;

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>) {
    if (onRangeChange) {
      const value = Number(event.target.value);
      onRangeChange(value);
    }
  }

  function handleRangeChangeEnd(event: PointerEvent<HTMLInputElement>) {
    if (onRangeChangeEnd) {
      onRangeChangeEnd(event, value);
    }
  } 

  return (
    <>
      <input
        ref={ref}
        type='range'
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={handleRangeChange}
        onPointerUp={handleRangeChangeEnd}
        style={style}
      />
      {numberInput && (
        <NumberInput
          ref={numberInputRef}
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={onInputChange}
          style={numberInputStyle}
        />
      )}
    </>
  )
});