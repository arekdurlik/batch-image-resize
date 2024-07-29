import { ChangeEvent, MouseEvent, useState } from 'react'
import { useAppStore } from '../../../../store/appStore'
import { SectionGroup, SectionHeader, SectionTitle } from '../../../styled/globals'
import { Rename } from './Rename'

export function Settings() {
  const [quality, setQuality] = useState(1);
  const api = useAppStore(state => state.api);

  function handleQuality(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuality(Number(value));
  }
  
  function setValue() {
    api.setQuality(quality);
  }
  return <>
    <SectionHeader style={{ marginTop: 39 }}>
      <SectionTitle>Settings</SectionTitle>
    </SectionHeader>
    <SectionGroup>
      <Rename/>
      <input type='range' min={0} max={1} step={0.01} value={quality} onChange={handleQuality} onMouseUp={setValue} style={{ width: '100%' }}/>
    </SectionGroup>
  </>
}


