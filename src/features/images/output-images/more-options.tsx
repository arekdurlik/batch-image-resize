import { MdDeselect, MdMoreHoriz, MdRefresh, MdSelectAll } from 'react-icons/md'
import { Button } from '../../ui/inputs/button'
import { Tooltip } from '../../ui/tooltip'
import { useRef, useState } from 'react'
import { ActionMenu } from '../../ui/action-menu'
import { IoMdTrash } from 'react-icons/io'
import { useApp } from '../../../store/app'
import { useOutputImages } from '../../../store/output-images'
import { useInputImages } from '../../../store/input-images'

export function MoreOptions() {
  const [actionMenuOpened, setActionMenuOpened] = useState(false);
  const button = useRef<HTMLButtonElement>(null!);
  const selectedItems = useApp(state => state.selectedItems);
  const inputImages = useInputImages(state => state.images);
  const inputImagesExist = inputImages.length > 0;
  const outputImages = useOutputImages(state => state.images);
  const outputImagesExist = outputImages.length > 0;
  const api = useOutputImages(state => state.api);
  const appApi = useApp(state => state.api);
  const selectedIsOutput = selectedItems[0]?.type === 'output';

  return (
    <>
      <Tooltip
        disabled={!inputImagesExist || actionMenuOpened}
        content={
          <Tooltip.Content>
            More options
          </Tooltip.Content>
        }
      >
        <Button 
          ref={button}
          disabled={!inputImagesExist}
          style={{ marginLeft: 8 }} 
        >
          <MdMoreHoriz/>
        </Button>
      </Tooltip>
      <ActionMenu 
        disabled={!inputImagesExist}
        actuator={button}
        align='right'
        onOpen={() => setActionMenuOpened(true)}
        onClose={() => setActionMenuOpened(false)}
      >
        <ActionMenu.Item
          label='Regenerate all'
          icon={MdRefresh}
          onClick={api.regenerate}
        />
        {outputImagesExist && (
          <ActionMenu.Item
            label='Select all'
            icon={MdSelectAll}
            onClick={api.selectAll}
          />
        )}
        {selectedIsOutput && (
          <ActionMenu.Item
            label='Deselect all'
            icon={MdDeselect}
            onClick={appApi.deselectAll}
          />
        )}
        {selectedIsOutput && <ActionMenu.Divider/>}
        {selectedIsOutput && (
          <ActionMenu.Item
            label='Delete selected'
            dangerous
            icon={IoMdTrash}
            onClick={appApi.deleteSelectedItems}
          />
        )}
    
      </ActionMenu>
    </>
  )
}