import { useEffect } from 'react';
import { useVariants } from '../../../store/variants/variants';
import { SectionHeader, SectionTitle } from '../../layout/styled';
import { AddVariant } from './add-variant';
import { Variant } from './variant';
import { ButtonGroup } from '../../ui/inputs/styled';
import { MoreOptions } from './more-options';
import { useStorage } from '../../../store/storage';

export function Variants() {
    const variantsApi = useVariants(state => state.api);
    const variants = useVariants(state => state.variants);
    const activeVariantId = useVariants(state => state.activeVariantId);
    const storeVariants = useStorage(state => state.settings.storeVariants);
    const storageApi = useStorage(state => state.api);

    useEffect(() => {
        if (storeVariants) {
            storageApi.setVariants(variants);
        }
    }, [variants, storeVariants]);

    function handleActivate(variantId: string) {
        variantsApi.setActive(activeVariantId === variantId ? undefined : variantId);
    }
    return (
        <>
            <SectionHeader>
                <SectionTitle>Variants</SectionTitle>
                <ButtonGroup>
                    <AddVariant />
                    <MoreOptions />
                </ButtonGroup>
            </SectionHeader>
            {variants.map(variant => (
                <Variant
                    key={variant.id}
                    active={variant.id === activeVariantId}
                    {...variant}
                    onActivate={() => handleActivate(variant.id)}
                />
            ))}
        </>
    );
}
