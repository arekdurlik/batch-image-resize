import { MdCheck, MdClose } from 'react-icons/md';
import { Button } from '../ui/inputs/button';
import { ButtonGroup } from '../ui/inputs/styled';
import { Details, Filename, Header } from './styled';
import { Resampling } from '../settings/variants/variant/settings/resampling';
import { OutputImageData } from '../../store/types';
import { useVariants } from '../../store/variants/variants';
import { Sharpening } from '../settings/variants/variant/settings/sharpening';
import { useOutputImages } from '../../store/output-images';
import { useEffect, useRef } from 'react';
import { shallowEqual } from '../../helpers';

export function EditImage({ image, onClose }: { image: OutputImageData; onClose: () => void }) {
    const variant = useVariants(state => state.variants).find(v => v.id === image.variantId)!;
    const api = useOutputImages(state => state.api);

    const resamplingData = image.resampling.enabled
        ? {
              enabled: true,
              filter: image.resampling.filter,
              quality: image.resampling.quality,
          }
        : {
              enabled: false,
              filter: variant.filter,
              quality: variant.quality,
          };

    const sharpeningData = image.sharpening.enabled
        ? {
              enabled: true,
              amount: image.sharpening.amount,
              radius: image.sharpening.radius,
              threshold: image.sharpening.threshold,
          }
        : {
              enabled: false,
              amount: variant.sharpenAmount,
              radius: variant.sharpenRadius,
              threshold: variant.sharpenThreshold,
          };

    const initialResamplingData = useRef(resamplingData);
    const initialSharpeningData = useRef(sharpeningData);
    const applied = useRef(false);
    const touched = useRef(false);

    useEffect(() => {
        return () => {
            if (!applied.current && touched.current) {
                if (
                    shallowEqual(resamplingData, initialResamplingData.current) &&
                    shallowEqual(sharpeningData, initialSharpeningData.current)
                ) {
                    return;
                }

                api.setResamplingData(image.id, initialResamplingData.current);
                api.setSharpenData(image.id, initialSharpeningData.current);
            }
        };
    }, []);

    useEffect(() => {
        initialSharpeningData.current = sharpeningData;
        initialResamplingData.current = resamplingData;
    }, [variant]);

    function handleApply() {
        applied.current = true;
        onClose?.();
    }

    function handleClose() {
        onClose?.();
    }

    function handleChange(cb: () => void) {
        touched.current = true;
        cb();
    }

    return (
        <Details>
            <Header>
                <Filename>Edit image</Filename>
                <ButtonGroup>
                    <Button style={{ flex: 1 }} onClick={handleApply}>
                        <MdCheck />
                        Apply
                    </Button>
                    <Button style={{ flex: 1 }} onClick={handleClose}>
                        <MdClose />
                    </Button>
                </ButtonGroup>
            </Header>

            <Resampling
                enabled={resamplingData.enabled}
                filter={resamplingData.filter}
                quality={resamplingData.quality}
                filterWidth={'100%'}
                qualityRangeWidth={'100%'}
                filterStyle={{ paddingLeft: 70 }}
                qualityStyle={{ paddingLeft: 58 }}
                onFilterChange={v => handleChange(() => api.setFilter(image.id, v))}
                onQualityChange={v => handleChange(() => api.setQuality(image.id, v / 100, false))}
                onQualityChangeEnd={v => handleChange(() => api.setQuality(image.id, v / 100))}
                onRevert={() => handleChange(() => api.setResamplingEnabled(image.id, false))}
            />

            <Sharpening
                enabled={sharpeningData.enabled}
                amount={sharpeningData.amount}
                radius={sharpeningData.radius}
                threshold={sharpeningData.threshold}
                rangeWidth={'100%'}
                amountStyle={{ paddingLeft: 52 }}
                radiusStyle={{ paddingLeft: 62 }}
                thresholdStyle={{ paddingLeft: 42 }}
                onAmountChange={v => handleChange(() => api.setSharpenAmount(image.id, v, false))}
                onAmountChangeEnd={v => handleChange(() => api.setSharpenAmount(image.id, v))}
                onRadiusChange={v => handleChange(() => api.setSharpenRadius(image.id, v, false))}
                onRadiusChangeEnd={v => handleChange(() => api.setSharpenRadius(image.id, v))}
                onThresholdChange={v =>
                    handleChange(() => api.setSharpenThreshold(image.id, v, false))
                }
                onThresholdChangeEnd={v => handleChange(() => api.setSharpenThreshold(image.id, v))}
                onRevert={() => handleChange(() => api.setSharpenEnabled(image.id, false))}
            />
        </Details>
    );
}
