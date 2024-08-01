import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { useAppStore } from '../../../../../store/appStore'
import { Variant as VariantType } from '../../../../../store/types'
import { IoMdTrash } from 'react-icons/io'
import styled from 'styled-components'
import { useToastsState } from '../../../../../store/toastsState'
import { HorizontalInputGroup, VerticalInputGroup } from '../../../../inputs/styled'
import { TextInput } from '../../../../inputs/TextInput'
import { Checkbox } from '../../../../inputs/Checkbox'
import { SectionGroup, SideBarSection } from '../../../../styled'
import { Button } from '../../../../inputs/Button'

export function Variant(variant: VariantType & { index: number }) {
  const [width, setWidth] = useState(variant.width ?? '');
  const [height, setHeight] = useState(variant.height ?? '');
  const [crop, setCrop] = useState(variant.crop ?? false);
  const api = useAppStore(state => state.api);
  const timeoutId = useRef<NodeJS.Timeout>();
  const openToast = useToastsState(state => state.openToast);

  const widthRef = useRef<string | number>();
  const heightRef = useRef<string | number>();

  widthRef.current = width;
  heightRef.current = height;

  const updateStoreWidth = useCallback(() => {
    clearTimeout(timeoutId.current);
    api.setVariantWidth(variant.id, widthRef.current ? Number(widthRef.current) : undefined);
  }, [api, variant.id]);

  const updateStoreHeight = useCallback(() => {
    clearTimeout(timeoutId.current);
    api.setVariantHeight(variant.id, heightRef.current ? Number(heightRef.current) : undefined);
  }, [api, variant.id]);

  const showToast = useCallback(() => 
    openToast('error', 'Photos are being regenerated. Try again in a moment.'), 
    [openToast]
  );

  const handleWidth = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId.current);

    const value = event.target.value;
    const regex =/^[0-9]+$/;

    if (value.match(regex)) {
      setWidth(Number(value));
      setHeight('');
    } else if (value === '') {
      setWidth('');
    } else return;

    timeoutId.current = setTimeout(updateStoreWidth, 350);
  }, [updateStoreWidth]);
  
  const handleHeight = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId.current);

    const value = event.target.value;
    const regex =/^[0-9]+$/;
    
    if (value.match(regex)) {
      setHeight(Number(value));
      setWidth('');
    } else if (value === '') {
      setHeight('');
    } else return;
    
    timeoutId.current = setTimeout(updateStoreHeight, 350);
  }, [updateStoreHeight]);

  return (
    <SectionGroup>
      <VariantName>
        Variant {variant.index + 1}
        <Button onClick={showToast}>
          <IoMdTrash/>Delete
        </Button>
      </VariantName>
      <SideBarSection>
        <VerticalInputGroup>
          <TextInput label='Prefix' value={variant.prefix} onChange={e => api.setVariantPrefix(variant.id, e.target.value)}/>
          <TextInput label='Suffix' value={variant.suffix} onChange={e => api.setVariantSuffix(variant.id, e.target.value)} />
        </VerticalInputGroup>
        <HorizontalInputGroup>
          <TextInput label='Width' value={width ?? ''} onChange={handleWidth} onBlur={updateStoreWidth}/>
          <TextInput label='Height' value={height ?? ''} onChange={handleHeight} onBlur={updateStoreHeight} />
        </HorizontalInputGroup>
        <Checkbox label='Crop into square' checked={crop} onChange={(e) => {
          const value = e.target.checked;
          setCrop(value);
          api.setVariantCrop(variant.id, value);
        }}/>
      </SideBarSection>
    </SectionGroup>
  )
}

const VariantName = styled.h4`
display: flex;
justify-content: space-between;
`