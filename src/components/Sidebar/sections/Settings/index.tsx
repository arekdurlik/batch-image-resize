import { TextInput } from '../../../inputs/TextInput'
import { SectionGroup, SectionHeader, SectionTitle } from '../../../styled/globals'
import { Rename } from './Rename'

export function Settings() {

  return <>
    <SectionHeader style={{ marginTop: 40 }}>
      <SectionTitle>Settings</SectionTitle>
    </SectionHeader>
    <SectionGroup>
      <Rename/>
      <TextInput label='Quality' value={100} />
    </SectionGroup>
  </>
}


