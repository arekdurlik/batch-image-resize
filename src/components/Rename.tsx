import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { TextInput } from './inputs/TextInput'
import { useAppStore } from '../store/appStore'
import { Collapsible } from './Collapsible'

export function Rename() {
  const [on, setOn] = useState(false);
  const { prefix, setPrefix, suffix, setSuffix } = useAppStore();

  function handlePrefix(e: ChangeEvent<HTMLInputElement>) {
    setPrefix(e.target.value);
  }

  function handleSuffix(e: ChangeEvent<HTMLInputElement>) {
    setSuffix(e.target.value);
  }
  
  return <>
    <Setting>
      <input type="checkbox" checked={on} onChange={() => setOn(v => !v)}/>
      Rename
    </Setting>
  
    <Collapsible open={on} startOpen={true}>
      <Options>
        <Setting>
        <input type="checkbox" checked={on} onChange={() => setOn(v => !v)}/>
        Index as name
        </Setting>
        <Setting>
          <TextInput label='Prefix' value={prefix} onChange={handlePrefix}/>
        </Setting>
        <Setting>
        <TextInput label='Suffix' value={suffix} onChange={handleSuffix}/>
        </Setting>
      </Options>
    </Collapsible>
  </>
}

export const SideBarSection = styled.div<{ border?: boolean }>`
${props => props.border && `border-bottom: 1px solid ${props.theme.border}`};
display: flex;
flex-direction: column;
padding: 10px;
transition: background-color 500ms;

&:hover {
  background-color: #e0e0e0;
}
`


const Setting = styled.div`
display: flex;
align-items: center;
gap: 10px;
font-weight: 500;
`

const Options = styled.div`
display: flex;
flex-direction: column;
padding: 10px 0;
`