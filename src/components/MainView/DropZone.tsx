import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useAppStore } from '../../store/appStore'
import styled from 'styled-components'

export function DropZone() {
  const api = useAppStore(state => state.api);

  const onDrop = useCallback((acceptedFiles : File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      console.error('rejected');
      return;
    }
    acceptedFiles.forEach((file) => {
      
      const img = new Image();
      img.onload = () => {
        api.addInputImage(file, img.width, img.height);
      }
      img.src = URL.createObjectURL(file);
    })

  }, []);
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
z-index: ${props => props.$isDragActive ? 2 : 0};
`