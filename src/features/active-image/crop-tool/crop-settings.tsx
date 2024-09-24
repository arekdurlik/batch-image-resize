import { ChangeEvent } from 'react'
import { Setting } from '../../settings/variants/variant/settings/setting'
import { ButtonGroup, HorizontalInputGroup, VerticalInputGroup } from '../../ui/inputs/styled'
import { TextInput } from '../../ui/inputs/text-input'
import { Details, Filename, Header } from '../styled'
import { Button } from '../../ui/inputs/button'
import { MdAlignHorizontalCenter, MdAlignVerticalCenter, MdCheck, MdClose } from 'react-icons/md'
import { useCropState } from './store'
import { NumberInput } from '../../ui/inputs/number-input'

export function CropSettings({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  const { api, ...cropState } = useCropState();

  function handleZoom(event: ChangeEvent<HTMLInputElement>) {
    api.setZoom(Number(event.target.value));
  }

  return (
    <>
      
      <Details>
        <Header>
          <Filename>Crop image</Filename>
          <ButtonGroup >
            <Button style={{ flex: 1 }} onClick={onConfirm}><MdCheck/>Apply</Button>
            <Button style={{ flex: 1 }} onClick={onCancel}><MdClose/></Button>
          </ButtonGroup>
        </Header>

        <HorizontalInputGroup style={{ marginRight: 13 }}>
          <VerticalInputGroup style={{ marginLeft: 39 }}>
            <Setting label='X' noUnitSpace>
              <NumberInput 
                value={cropState.x}
                min={0}
                max={1}
                onChange={api.setX}
                align='end' 
                />
            </Setting>
          </VerticalInputGroup>
          <VerticalInputGroup style={{ marginLeft: 0 }}>
            <Setting label='Y' noUnitSpace>
              <NumberInput
                value={cropState.y}
                min={0}
                max={1}
                onChange={api.setY}
                align='end'
              />
            </Setting>
          </VerticalInputGroup>
          <ButtonGroup>
            <Button onClick={() => api.setX(0.5)}><MdAlignHorizontalCenter/></Button>
            <Button onClick={() => api.setY(0.5)}><MdAlignVerticalCenter/></Button>
          </ButtonGroup>
        </HorizontalInputGroup>
        <VerticalInputGroup>
            <Setting label='Zoom' unit='x' unitWidth={7}>
              <input 
                type='range'
                style={{ width: '100%' }}
                value={cropState.zoom} 
                min={cropState.minZoom} 
                max={cropState.minZoom * 10}
                step={0.01} 
                onChange={handleZoom}
              />
              <TextInput 
                value={cropState.zoom > 9.99 ? cropState.zoom.toFixed(1) : cropState.zoom.toFixed(2)}
                onChange={handleZoom}
                align='end'
                style={{ maxWidth: 41, minWidth: 46 }} 
              />
            </Setting>
          </VerticalInputGroup>
          <HorizontalInputGroup style={{ justifyContent: 'center'}}>
          
          </HorizontalInputGroup>
      </Details>
    </>
  )
}