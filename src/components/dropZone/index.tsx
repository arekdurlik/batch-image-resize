import { useDropzone } from 'react-dropzone'

export function DropZone() {
  const { open } = useDropzone();
  
  return <div>
    dropzone
  </div>
}