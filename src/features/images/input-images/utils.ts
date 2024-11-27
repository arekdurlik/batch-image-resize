import { FileRejection } from 'react-dropzone';
import { getFileExtension } from '../../../lib/helpers';
import { Log } from '../../../lib/log';
import { openToast, ToastType } from '../../../store/toasts';
import { UploadedImage } from '../../../store/types';
import { useInputImages } from '../../../store/input-images';

export function handleUpload(acceptedFiles: File[], fileRejections: FileRejection[]) {
    if (fileRejections.length) {
        Log.error('Error uploading files.', fileRejections);
        const rejectedFormats = fileRejections
            .map(rejection => getFileExtension(rejection.file.name))
            .filter(v => v.length)
            .map(v => `".${v}"`)
            .join(', ');

        openToast(
            ToastType.ERROR,
            `Uploads with file type ${rejectedFormats} are not supported. Please try again.`
        );
        return;
    }

    const promises: Promise<UploadedImage>[] = [];

    acceptedFiles.forEach(file => {
        const img = new Image();

        promises.push(
            new Promise(resolve => {
                img.onload = () => {
                    resolve({ file, width: img.width, height: img.height });
                };
            })
        );

        img.src = URL.createObjectURL(file);
    });

    Promise.all(promises).then(images => useInputImages.getState().api.add(images));
}
