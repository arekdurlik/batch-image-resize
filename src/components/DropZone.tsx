import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useAppStore } from '../store/appStore'

export function DropZone() {
  const { addImage } = useAppStore();

  const onDrop = useCallback((acceptedFiles : File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      console.error('rejected');
      return;
    }
    acceptedFiles.forEach((file, index) => {
      
      const img = new Image();
      img.onload = () => {
        const object = { file, width: img.width, height: img.height };
        addImage(object);
      }
      img.src = URL.createObjectURL(file);
    })

  }, []);
  const { getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop, accept: {
    'image/jpeg': [],
    'image/png': []
  } });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}