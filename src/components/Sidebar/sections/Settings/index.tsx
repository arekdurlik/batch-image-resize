import { ChangeEvent } from 'react'
import { useAppStore } from '../../../../store/appStore'
import { TextInput } from '../../../inputs/TextInput'
import { SectionGroup, SectionHeader, SectionTitle } from '../../../styled/globals'
import { Rename } from './Rename'

export function Settings() {
  const { quality, api } = useAppStore();

  function handleQuality(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (value === '') api.setQuality(value);
    const regex =/^[0-9]+$/;

    if (!value.match(regex)) return;

    let numValue = Number(value);

    if (numValue > 100) {
      numValue = 100;
    } else if (numValue < 0) {
      numValue = 0;
    }

    api.setQuality(numValue);
  }
  return <>
    <SectionHeader style={{ marginTop: 40 }}>
      <SectionTitle>Settings</SectionTitle>
    </SectionHeader>
    <SectionGroup>
      <Rename/>
      <TextInput label='Quality' value={quality} onChange={handleQuality}/>
    </SectionGroup>
  </>
}


