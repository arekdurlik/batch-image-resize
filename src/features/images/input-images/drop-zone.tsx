import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { useInputImages } from '../../../store/input-images'
import { Log } from '../../../lib/log'
import { getFileExtension } from '../../../lib/helpers'
import { openToast, ToastType } from '../../../store/toasts'
import { UploadedImage } from '../../../store/types'

export function DropZone() {
  const api = useInputImages(state => state.api);

  const onDrop = useCallback((acceptedFiles : File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      Log.error('Error uploading files.', fileRejections);
      const rejectedFormats = fileRejections
        .map(rejection => getFileExtension(rejection.file.name))
        .filter(v => v.length)
        .map(v => `"${v}"`)
        .join(', ');

      openToast(
        ToastType.ERROR, 
        `Uploads with file type ${rejectedFormats} are not supported. Please try again.`
      );
      return;
    }

    const promises: Promise<UploadedImage>[] = [];

    acceptedFiles.forEach((file) => {
      const img = new Image();

      promises.push(new Promise(resolve => {
        img.onload = () => {
          resolve({ file, width: img.width, height: img.height });
        }
      }));

      img.src = URL.createObjectURL(file);
    });

    Promise.all(promises).then(images => api.add(images));
  }, [api]);

  const { getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop, accept: {
    'image/jpeg': [],
    'image/png': []
  } });

  return (
    <Wrapper {...getRootProps()} $isDragActive={isDragActive}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop files here, or click to select files</p>
      }
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isDragActive: boolean }>`
position: absolute;
inset: 0;
z-index: 3;
`