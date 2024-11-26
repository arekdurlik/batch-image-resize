import { MdUpload } from 'react-icons/md'
import { Button } from '../../ui/inputs/button'
import { handleUpload } from './utils'
import { useDropzone } from 'react-dropzone'

export function UploadButton() {
  const { getRootProps } = useDropzone({ 
    noDrag: true,
    onDrop: handleUpload, 
    accept: {
      'image/jpeg': [],
      'image/png': []
    } 
  });

  return (
    <Button {...getRootProps()}><MdUpload/>Upload</Button>
  )
}
