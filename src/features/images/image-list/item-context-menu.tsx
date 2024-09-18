import { RefObject, useEffect, useState } from 'react'
import { useApp } from '../../../store/app'
import { ImageData } from '../../../store/types'
import { ContextMenu } from '../../ui/context-menu'
import { IoMdTrash } from 'react-icons/io'
import { MdFileCopy, MdImage, MdSaveAs } from 'react-icons/md'
import { openToast, ToastType } from '../../../store/toasts'

type Props = { 
  actuator: RefObject<HTMLElement>, 
  type: 'input' | 'output', 
  image: ImageData, 
  lastSelected: boolean, 
  listFocused: boolean 
};

export function ItemContextMenu({ actuator, type, image, lastSelected, listFocused }: Props) {
  const appApi = useApp(state => state.api)
  const selectedItems = useApp(state => state.selectedItems);
  const active = selectedItems.map(i => i.id).some(i => i === image.id);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!lastSelected || !listFocused) return;

    function handler(event: KeyboardEvent) {
      switch (event.key) {
        case 'Enter':
        case ' ':
          setIsOpen(true);
          break;
      }
    }
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [lastSelected, listFocused])

  function handleContextMenuOpen() {
    setIsOpen(true);
    if (!active) {
      appApi.selectItems([{ type, id: image.id }]);
    }
  }

  function copyImage() {
    try {
      navigator.clipboard.write([
        new ClipboardItem({
            'image/png': image.image.full.file
        })
      ]);
      openToast(ToastType.SUCCESS, 'Image copied to clipboard.');
    } catch (error) {
      openToast(ToastType.ERROR, 'Error copying image to clipboard.');
    }
  }

  return (
    <ContextMenu 
      actuator={actuator} 
      open={isOpen}
      onOpen={handleContextMenuOpen} 
      onClose={() => setIsOpen(false)} 
    >
      {type !== 'input' && selectedItems.length > 1 && (
        <ContextMenu.Item
          label='Save images as...'
          icon={MdSaveAs}
        />
      )}
      {selectedItems.length  === 1 && (
        <ContextMenu.Item
          label='Open image in a new tab'
          icon={MdImage}
          onClick={() => window.open(image.image.full.src)}
        />
      )}
      {type !== 'input' && selectedItems.length  === 1 && (
        <ContextMenu.Item
          label='Save image as...'
          icon={MdSaveAs}
        />
      )}
      {selectedItems.length  === 1 && (
        <ContextMenu.Item
          label='Copy image'
          icon={MdFileCopy}
          onClick={copyImage}
        />
      )}
      {!(type === 'input' && selectedItems.length > 1) && <ContextMenu.Divider/>}
      <ContextMenu.Item
        label='Delete'
        icon={IoMdTrash}
        dangerous
        onClick={appApi.deleteSelectedItems}
      />
    </ContextMenu>
  )
}