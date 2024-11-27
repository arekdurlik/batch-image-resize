import { useState } from 'react';
import { useVariants } from '../../../store/variants';
import { SectionHeader, SectionTitle } from '../../layout/styled';
import { AddVariant } from './add-variant';
import { Variant } from './variant';

export function Variants() {
    const variants = useVariants(state => state.variants);
    const [activeVariant, setActiveVariant] = useState<string | undefined>(variants[0]?.id);

    function handleActivate(variantId: string) {
        setActiveVariant(activeVariant === variantId ? undefined : variantId);
    }
    return (
        <>
            <SectionHeader>
                <SectionTitle>Variants</SectionTitle>
                <AddVariant onAdd={setActiveVariant} />
            </SectionHeader>
            {variants.map(variant => (
                <Variant
                    key={variant.id}
                    active={variant.id === activeVariant}
                    startOpen={variants.length === 1}
                    {...variant}
                    onActivate={() => handleActivate(variant.id)}
                />
            ))}
        </>
    );
}
