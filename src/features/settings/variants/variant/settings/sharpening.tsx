import { VerticalInputGroup } from '../../../../ui/inputs/styled';
import { Bold } from './styled';
import { Setting } from './setting';
import { RangeInput } from '../../../../ui/inputs/range-input';
import { MdRefresh } from 'react-icons/md';
import { Button } from '../../../../ui/inputs/button';
import { CSSProperties } from 'react';
import { SHARPEN_AMOUNT_MAX, SHARPEN_AMOUNT_MIN, SHARPEN_RADIUS_MAX, SHARPEN_RADIUS_MIN, SHARPEN_THRESHOLD_MAX, SHARPEN_THRESHOLD_MIN } from '../../../../../store/variants/utils';

type Props = {
    enabled?: boolean;
    amount: number;
    radius: number;
    threshold: number;
    rangeWidth?: number | string;
    inputWidth?: number | string;
    amountStyle?: CSSProperties;
    radiusStyle?: CSSProperties;
    thresholdStyle?: CSSProperties;
    onAmountChange: (value: number) => void;
    onAmountChangeEnd: (value: number) => void;
    onRadiusChange: (value: number) => void;
    onRadiusChangeEnd: (value: number) => void;
    onThresholdChange: (value: number) => void;
    onThresholdChangeEnd: (value: number) => void;
    onRevert?: () => void;
};
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
    onRevert,
}: Props) {
    return (
        <>
            <Bold>
                Sharpening
                {enabled && (
                    <Button onClick={onRevert}>
                        <MdRefresh />
                        Use variant settings
                    </Button>
                )}
            </Bold>
            <VerticalInputGroup>
                <Setting label="Amount" unit="%" style={amountStyle}>
                    <RangeInput
                        min={SHARPEN_AMOUNT_MIN}
                        max={SHARPEN_AMOUNT_MAX}
                        step={1}
                        value={amount}
                        onRangeChange={onAmountChange}
                        onRangeChangeEnd={onAmountChangeEnd}
                        onInputChange={onAmountChangeEnd}
                        style={{ width: '100%', maxWidth: rangeWidth }}
                        numberInput
                        numberInputStyle={{ maxWidth: inputWidth }}
                        numberInputAlign="end"
                    />
                </Setting>

                <Setting label="Radius" unit="px" style={radiusStyle}>
                    <RangeInput
                        min={SHARPEN_RADIUS_MIN}
                        max={SHARPEN_RADIUS_MAX}
                        step={0.1}
                        value={radius}
                        onRangeChange={onRadiusChange}
                        onRangeChangeEnd={onRadiusChangeEnd}
                        onInputChange={onRadiusChangeEnd}
                        style={{ width: '100%', maxWidth: rangeWidth }}
                        numberInput
                        numberInputStyle={{ maxWidth: inputWidth }}
                        numberInputAlign="end"
                    />
                </Setting>

                <Setting label="Threshold" unit="lvls" style={thresholdStyle}>
                    <RangeInput
                        min={SHARPEN_THRESHOLD_MIN}
                        max={SHARPEN_THRESHOLD_MAX}
                        step={1}
                        value={threshold}
                        onRangeChange={onThresholdChange}
                        onRangeChangeEnd={onThresholdChangeEnd}
                        onInputChange={onThresholdChangeEnd}
                        style={{ width: '100%', maxWidth: rangeWidth }}
                        numberInput
                        numberInputStyle={{ maxWidth: inputWidth }}
                        numberInputAlign="end"
                    />
                </Setting>
            </VerticalInputGroup>
        </>
    );
}
