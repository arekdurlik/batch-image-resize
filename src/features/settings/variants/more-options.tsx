import { MdDownload, MdMoreHoriz, MdUpload } from 'react-icons/md';
import { Button } from '../../ui/inputs/button';
import { Tooltip } from '../../ui/tooltip';
import { useRef, useState } from 'react';
import { ActionMenu } from '../../ui/action-menu';
import { useVariants } from '../../../store/variants/variants';
import { mapToFullVariant, validateJSONVariants, validateVariants } from './utils';
import { openToast, ToastType } from '../../../store/toasts';

export function MoreOptions() {
    const [actionMenuOpened, setActionMenuOpened] = useState(false);
    const button = useRef<HTMLButtonElement>(null!);
    const variantsApi = useVariants(state => state.api);

    async function handleSave() {
        const variants = useVariants.getState().variants;

        const saveObj = JSON.stringify(variants);
        const blob = new Blob([saveObj]);

        const variantNames = variants
            .map(variant => variant.name.replace(' ', '-').toLowerCase())
            .join('_');
        const filename = `batch_resizer_variants_${variantNames}.json`;

        if ('showSaveFilePicker' in window) {
            const handle = await showSaveFilePicker({
                suggestedName: filename,
                types: [
                    {
                        accept: { 'application/json': ['.json'] },
                    },
                ],
            });

            const writableStream = await handle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
        } else {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.click();
        }
    }

    async function handleLoad() {
        function readFile(file: File) {
            const fileReader = new FileReader();

            fileReader.onload = function (e: ProgressEvent<FileReader>) {
                try {
                    if (e.target === null) {
                        throw new Error('Error reading file.');
                    }

                    const result = e.target.result;

                    if (typeof result !== 'string') {
                        throw new Error('Invalid file format.');
                    }

                    const variants = validateJSONVariants(result);
                    validateVariants(variants);
                    const fullVariants = variants.map(variant => mapToFullVariant(variant));
                    variantsApi.set(fullVariants);

                    openToast(ToastType.SUCCESS, 'Variants loaded successfully.');
                } catch (error) {
                    if (error instanceof Error) {
                        openToast(ToastType.ERROR, error.message);
                    }
                }
            };
            fileReader.readAsText(file);
        }

        if ('showSaveFilePicker' in window) {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        accept: { 'application/json': ['.json'] },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });

            const file = await fileHandle.getFile();

            readFile(file);
        } else {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', () => {
                if (input.files) {
                    readFile(input.files[0]);
                }
            });
            input.click();
        }
    }

    return (
        <>
            <Tooltip content={<Tooltip.Content>More options</Tooltip.Content>}>
                <Button ref={button} active={actionMenuOpened} slim>
                    <MdMoreHoriz />
                </Button>
            </Tooltip>
            <ActionMenu
                actuator={button}
                align="right"
                onOpen={() => setActionMenuOpened(true)}
                onClose={() => setActionMenuOpened(false)}
            >
                <ActionMenu.Item label="Save to file" icon={MdDownload} onClick={handleSave} />
                <ActionMenu.Item label="Load from file" icon={MdUpload} onClick={handleLoad} />
            </ActionMenu>
        </>
    );
}
