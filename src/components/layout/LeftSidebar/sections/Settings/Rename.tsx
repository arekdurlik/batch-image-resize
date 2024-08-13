import { ChangeEvent, useState } from 'react'
import { Checkbox } from '../../../../inputs/Checkbox'
import { Collapsible } from '../../../../Collapsible'
import { VerticalInputGroup } from '../../../../inputs/styled'
import { TextInput } from '../../../../inputs/TextInput'
import { useApp } from '../../../../../store/app'

export function Rename() {
  const [on, setOn] = useState(false);
  const prefix = useApp(state => state.prefix);
  const suffix = useApp(state => state.suffix);
  const indexAsName = useApp(state => state.indexAsName);
  const api = useApp(state => state.api);

  function handlePrefix(e: ChangeEvent<HTMLInputElement>) {
    api.setPrefix(e.target.value);
  }

  function handleSuffix(e: ChangeEvent<HTMLInputElement>) {
    api.setSuffix(e.target.value);
  }
  
  return <>
    <Checkbox 
      label='Rename all' 
      checked={on} 
      onChange={() => setOn(v => !v)}
    />
    <Collapsible open={on} startOpen={true}>
      <VerticalInputGroup>
        <Checkbox 
          label='Index as name' 
          checked={indexAsName} 
          onChange={() => api.setIndexAsName(!indexAsName)} 
          style={{ marginTop: 10 }}
        />
        <TextInput 
          label='Prefix' 
          value={prefix} 
          onChange={handlePrefix}
        />
        <TextInput 
          label='Suffix' 
          value={suffix} 
          onChange={handleSuffix}
        />
      </VerticalInputGroup>
    </Collapsible>
  </>
}


