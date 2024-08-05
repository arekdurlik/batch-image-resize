import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Variant as VariantType } from '../../../../../store/types'
import { IoMdTrash } from 'react-icons/io'
import styled from 'styled-components'
import { useToasts } from '../../../../../store/toasts'
import { HorizontalInputGroup, VerticalInputGroup } from '../../../../inputs/styled'
import { TextInput } from '../../../../inputs/TextInput'
import { Checkbox } from '../../../../inputs/Checkbox'
import { SectionGroup, SideBarSection } from '../../../../styled'
import { Button } from '../../../../inputs/Button'
import { useVariants } from '../../../../../store/variants'

export function Variant(variant: VariantType & { index: number }) {
  const [width, setWidth] = useState(variant.width ?? '');
  const [height, setHeight] = useState(variant.height ?? '');
  const [crop, setCrop] = useState(variant.crop ?? false);
  const api = useVariants(state => state.api);
  const timeoutId = useRef<NodeJS.Timeout>();
  const openToast = useToasts(state => state.openToast);

  const widthRef = useRef<string | number>();
  const heightRef = useRef<string | number>();

  widthRef.current = width;
  heightRef.current = height;

  const updateStoreWidth = useCallback(() => {
    clearTimeout(timeoutId.current);
    api.setDimension('width', variant.id, widthRef.current ? Number(widthRef.current) : undefined);
  }, [api, variant.id]);

  const updateStoreHeight = useCallback(() => {
    clearTimeout(timeoutId.current);
    api.setDimension('height', variant.id, heightRef.current ? Number(heightRef.current) : undefined);
  }, [api, variant.id]);

  const showToast = useCallback(() => 
    openToast('error', 'Photos are being regenerated. Try again in a moment.'), 
    [openToast]
  );

  const handleWidth = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId.current);

    const value = event.target.value;

    if (value === width) return;
    
    const regex =/^[0-9]+$/;

    if (value.match(regex)) {
      setWidth(Number(value));
      setHeight('');
    } else if (value === '') {
      setWidth('');
    } else return;

    timeoutId.current = setTimeout(updateStoreWidth, 50);
  }, [width, updateStoreWidth]);
  
  const handleHeight = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId.current);

    const value = event.target.value;

    if (value === height) return;

    const regex =/^[0-9]+$/;
    
    if (value.match(regex)) {
      setHeight(Number(value));
      setWidth('');
    } else if (value === '') {
      setHeight('');
    } else return;
    
    timeoutId.current = setTimeout(updateStoreHeight, 50);
  }, [height, updateStoreHeight]);

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
          <TextInput label='Prefix' value={variant.prefix} onChange={e => api.setFilenamePart('prefix', variant.id, e.target.value)}/>
          <TextInput label='Suffix' value={variant.suffix} onChange={e => api.setFilenamePart('suffix', variant.id, e.target.value)} />
        </VerticalInputGroup>
        <HorizontalInputGroup>
          <TextInput label='Width' value={width ?? ''} onChange={handleWidth}/>
          <TextInput label='Height' value={height ?? ''} onChange={handleHeight}/>
        </HorizontalInputGroup>
        <Checkbox label='Crop into square' checked={crop} onChange={(e) => {
          const value = e.target.checked;
          setCrop(value);
          api.setCrop(variant.id, value);
        }}/>
      </SideBarSection>
    </SectionGroup>
  )
}

const VariantName = styled.h4`
display: flex;
justify-content: space-between;
`