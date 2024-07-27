import { ChangeEvent, useRef, useState } from 'react'
import { useAppStore, Variant as VariantType } from '../../../../store/appStore'
import { Button, SectionGroup, SideBarSection } from '../../../styled/globals'
import { TextInput } from '../../../inputs/TextInput'
import { HorizontalInputGroup, VerticalInputGroup } from '../../../inputs/styled'
import { IoMdTrash } from 'react-icons/io'
import styled from 'styled-components'
import { Checkbox } from '../../../inputs/Checkbox'

export function Variant(variant: VariantType & { index: number }) {
  const [prefix, setPrefix] = useState(variant.prefix);
  const [suffix, setSuffix] = useState(variant.suffix);
  const [width, setWidth] = useState(variant.width ?? '');
  const [height, setHeight] = useState(variant.height ?? '');
  const [crop, setCrop] = useState(variant.crop ?? false);
  const api = useAppStore(state => state.api);
  const timeoutId = useRef<NodeJS.Timeout>();

  function updateStoreValues() {
    clearTimeout(timeoutId.current);
    api.setVariantWidth(variant.id, width ? Number(width) : undefined);
    api.setVariantHeight(variant.id, height ? Number(height) : undefined);
  }

  function handleWidth(event: ChangeEvent<HTMLInputElement>) {
    clearTimeout(timeoutId.current);

    const value = event.target.value;
    const regex =/^[0-9]+$/;

    if (value.match(regex)) {
      setWidth(Number(value));
      setHeight('');
    } else if (value === '') {
      setWidth('');
    } else return;

    timeoutId.current = setTimeout(updateStoreValues, 200);
  }
  
  function handleHeight(event: ChangeEvent<HTMLInputElement>) {
    clearTimeout(timeoutId.current);

    const value = event.target.value;
    const regex =/^[0-9]+$/;
    
    if (value.match(regex)) {
      setHeight(Number(value));
      setWidth('');
    } else if (value === '') {
      setHeight('');
    } else return;
    
    timeoutId.current = setTimeout(updateStoreValues, 200);
  }

  return <SectionGroup>
    <VariantName>
      Variant {variant.index + 1}
      <Button>
        <IoMdTrash/>Delete
      </Button>
    </VariantName>
    <SideBarSection>
      <VerticalInputGroup>
        <TextInput label='Prefix' value={prefix} onChange={e => setPrefix(e.target.value)} onBlur={e => api.setVariantPrefix(variant.id, e.target.value)}/>
        <TextInput label='Suffix' value={suffix} onChange={e => setSuffix(e.target.value)} onBlur={e => api.setVariantSuffix(variant.id, e.target.value)}/>
      </VerticalInputGroup>
      <HorizontalInputGroup>
        <TextInput label='Width' value={width ?? ''} onChange={handleWidth} onBlur={updateStoreValues}/>
        <TextInput label='Height' value={height ?? ''} onChange={handleHeight} onBlur={updateStoreValues} />
      </HorizontalInputGroup>
      <Checkbox label='Crop into square' checked={crop} onChange={(e) => {
        const value = e.target.checked;
        setCrop(value);
        api.setVariantCrop(variant.id, value);
      }}/>
    </SideBarSection>
  </SectionGroup>
}

const VariantName = styled.h4`
display: flex;
justify-content: space-between;
`