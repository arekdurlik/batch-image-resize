import { MdDeselect, MdMoreHoriz, MdSelectAll } from 'react-icons/md'
import { Button } from '../../ui/inputs/button'
import { Tooltip } from '../../ui/tooltip'
import { useRef, useState } from 'react'
import { ActionMenu } from '../../ui/action-menu'
import { IoMdTrash } from 'react-icons/io'
import { useApp } from '../../../store/app'
import { useInputImages } from '../../../store/input-images'

export function MoreOptions() {
  const [actionMenuOpened, setActionMenuOpened] = useState(false);
  const button = useRef<HTMLButtonElement>(null!);
  const selectedItems = useApp(state => state.selectedItems);
  const latestSelectedItem = useApp(state => state.latestSelectedItem);
  const latestSelectedItemIsInput = latestSelectedItem?.type === 'input'
  const inputImages = useInputImages(state => state.images);
  const inputImagesExist = inputImages.length > 0;
  const api = useInputImages(state => state.api);
  const appApi = useApp(state => state.api);
  const selectedIsInput = selectedItems[0]?.type === 'input';

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
          active={actionMenuOpened}
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
          label='Select all'
          icon={MdSelectAll}
          onClick={api.selectAll}
        />
        {(selectedIsInput || latestSelectedItemIsInput) && (
          <ActionMenu.Item
            label='Deselect all'
            icon={MdDeselect}
            onClick={appApi.deselectAll}
          />
        )}
        <ActionMenu.Divider/>
        {selectedIsInput && (
          <ActionMenu.Item
            label='Delete selected'
            dangerous
            icon={IoMdTrash}
            onClick={appApi.deleteSelectedItems}
          />
        )}
        {selectedItems.length !== inputImages.length && (
          <ActionMenu.Item
            label='Delete all'
            dangerous
            icon={IoMdTrash}
            onClick={api.deleteAll}
          />
        )}
      </ActionMenu>
    </>
  )
}