import { RefObject, useEffect, useState } from 'react';
import { useApp } from '../../../../../store/app';
import { ImageData } from '../../../../../store/types';
import { ContextMenu } from '../../../../ui/context-menu';
import { IoMdTrash } from 'react-icons/io';
import { MdFileCopy, MdImage, MdSaveAs } from 'react-icons/md';
import { openToast, ToastType } from '../../../../../store/toasts';
import { getFileExtension } from '../../../../../lib/helpers';
import { ChangeOrder } from './change-order';

type Props = {
    actuator: RefObject<HTMLElement>;
    type: 'input' | 'output';
    image: ImageData;
    lastSelected: boolean;
    listFocused: boolean;
    onClose?: () => void;
};

export function ItemContextMenu({
    actuator,
    type,
    image,
    lastSelected,
    listFocused,
    onClose,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const appApi = useApp(state => state.api);
    const selectedItems = useApp(state => state.selectedItems);
    const active = selectedItems.map(i => i.id).some(i => i === image.id);

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
    }, [lastSelected, listFocused]);

    function handleContextMenuOpen() {
        setIsOpen(true);
        if (!active) {
            appApi.selectItems([{ type, id: image.id }]);
        }
    }

    function handleCopyImage() {
        try {
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': image.image.full.file,
                }),
            ]);
            openToast(ToastType.SUCCESS, 'Image copied to clipboard.');
        } catch (error) {
            openToast(ToastType.ERROR, 'Error copying image to clipboard.');
        }
    }

    function handleSaveAs() {
        if (typeof window.showSaveFilePicker !== 'undefined') {
            downloadWithPicker();
        } else {
            downloadRegular();
        }
    }

    async function downloadWithPicker() {
        let type = {
            description: '',
            accept: {},
        };

        switch (getFileExtension(image.filename)) {
            case 'jpg':
            case 'pjp':
            case 'pjpeg':
            case 'jfif':
            case 'jpeg':
                type = {
                    description: 'JPEG Image',
                    accept: { 'image/jpeg': ['.jpg'] },
                };
                break;
            case 'png':
                type = {
                    description: 'PNG Image',
                    accept: { 'image/png': ['.png'] },
                };
                break;
        }

        const newHandle = await window.showSaveFilePicker({
            suggestedName: image.filename,
            types: [type],
        });

        const writableStream = await newHandle.createWritable();
        await writableStream.write(image.image.full.file);
        await writableStream.close();
    }

    function downloadRegular() {
        const a = document.createElement('a');
        a.href = image.image.full.src;
        a.download = image.filename;
        a.click();
    }

    return (
        <ContextMenu
            actuator={actuator}
            open={isOpen}
            onOpen={handleContextMenuOpen}
            onClose={() => {
                setIsOpen(false);
                onClose?.();
            }}
        >
            {selectedItems.length === 1 && (
                <ContextMenu.Item
                    label="Open image in a new tab"
                    icon={MdImage}
                    onClick={() => {
                        window.open(image.image.full.src);
                    }}
                />
            )}
            {type === 'output' && selectedItems.length === 1 && (
                <ContextMenu.Item label="Save image as..." icon={MdSaveAs} onClick={handleSaveAs} />
            )}
            {selectedItems.length === 1 && (
                <ContextMenu.Item label="Copy image" icon={MdFileCopy} onClick={handleCopyImage} />
            )}
            {type === 'input' && <ChangeOrder />}

            {selectedItems.length === 1 && <ContextMenu.Divider />}
            <ContextMenu.Item
                label="Delete"
                icon={IoMdTrash}
                dangerous
                onClick={appApi.deleteSelectedItems}
            />
        </ContextMenu>
    );
}
