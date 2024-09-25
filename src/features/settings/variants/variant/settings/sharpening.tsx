import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { Bold } from './styled'
import { Setting } from './setting'
import { RangeInput } from '../../../../ui/inputs/range-input'
import { MdRefresh } from 'react-icons/md'
import styled from 'styled-components'
import { Button } from '../../../../ui/inputs/button'
import { CSSProperties } from 'react'

type Props = {
  enabled?: boolean
  amount: number
  radius: number
  threshold: number
  rangeWidth?: number | string
  inputWidth?: number | string
  amountStyle?: CSSProperties
  radiusStyle?: CSSProperties
  thresholdStyle?: CSSProperties
  onAmountChange: (value: number) => void
  onAmountChangeEnd: (value: number) => void
  onRadiusChange: (value: number) => void
  onRadiusChangeEnd: (value: number) => void
  onThresholdChange: (value: number) => void
  onThresholdChangeEnd: (value: number) => void
  onRevert?: () => void
}
export function Sharpening({ 
  enabled, 
  amount, 
  radius, 
  threshold,
  rangeWidth = 120,
  inputWidth = 41,
  amountStyle,
  radiusStyle,
  thresholdStyle,
  onAmountChange,
  onAmountChangeEnd, 
  onRadiusChange, 
  onRadiusChangeEnd, 
  onThresholdChange, 
  onThresholdChangeEnd, 
  onRevert 
}: Props) {

  return (
    <>
      <Bold>
        Sharpening
        {enabled && (
          <Button onClick={onRevert}>
            <MdRefresh/>Use variant settings
          </Button>
        )}
      </Bold>
      <VerticalInputGroup>
        <Setting label='Amount' unit='%' style={amountStyle}>
          <RangeInput 
            min={0}
            max={500}
            step={1}
            value={amount}
            onRangeChange={onAmountChange}
            onRangeChangeEnd={onAmountChangeEnd}
            onInputChange={onAmountChangeEnd}
            style={{ width: '100%', maxWidth: rangeWidth }}
            numberInput
            numberInputStyle={{ maxWidth: inputWidth }}
            numberInputAlign='end'
          />
        </Setting>

        <Setting label='Radius' unit='px' style={radiusStyle}>
          <RangeInput 
            min={0.5}
            max={2}
            step={0.1}
            value={radius}
            onRangeChange={onRadiusChange}
            onRangeChangeEnd={onRadiusChangeEnd}
            onInputChange={onRadiusChangeEnd}
            style={{ width: '100%', maxWidth: rangeWidth }}
            numberInput
            numberInputStyle={{ maxWidth: inputWidth }}
            numberInputAlign='end'
          />
        </Setting>

        <Setting label='Threshold' unit='lvls' style={thresholdStyle}>
          <RangeInput 
            min={0}
            max={255}
            step={1}
            value={threshold}
            onRangeChange={onThresholdChange}
            onRangeChangeEnd={onThresholdChangeEnd}
            onInputChange={onThresholdChangeEnd}
            style={{ width: '100%', maxWidth: rangeWidth }}
            numberInput
            numberInputStyle={{ maxWidth: inputWidth }}
            numberInputAlign='end'
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}

const Revert = styled(MdRefresh)`
position: relative;
top: 2px;
color: var(--fgColor-icon);
fill: var(--fgColor-icon);
`