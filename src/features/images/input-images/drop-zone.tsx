import { useDropzone } from 'react-dropzone'
import styled, { css } from 'styled-components'
import { MdCloudUpload } from 'react-icons/md'
import { handleUpload } from './utils'

export function DropZone() {
  const { getRootProps, getInputProps, isDragActive,  } = useDropzone({
    onDrop: handleUpload,
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });

  return (
    <Wrapper {...getRootProps()} $isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <DropArea>
        <Icon/>
        <Cue>Drag and drop files to upload</Cue>
        <Browse>or click to select files</Browse>
      </DropArea>
    </Wrapper>
  )
}

const Icon = styled(MdCloudUpload)`
font-size: 82px;
min-height: 82px;
fill: color-mix(in hsl, black, transparent 80%);
margin-bottom: 5px;
`

const Cue = styled.span`
font-size: 1.5em;
font-weight: 600;
`

const Browse = styled.span`
font-weight: 600;
`

const DropArea = styled.div`
flex: 1;
max-width: 500px;
max-height: 250px;
width: 100%;
height: 100%;
background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='5' ry='5' stroke='hsl(220, 11%, 78%)' stroke-width='2' stroke-dasharray='4 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
border-radius: 5px;
transition: background-color var(--transition-default);

display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
overflow: hidden;
`

const Wrapper = styled.div<{ $isDragActive: boolean }>`
position: absolute;
padding: var(--spacing-large);
inset: 0;
z-index: 3;
display: flex;
justify-content: center;
align-items: center;
overflow-y: scroll;
cursor: pointer;

transition: background-color var(--transition-default);
&:hover {
  ${DropArea} {
    background-color: var(--control-default-bgColor-rest);
  }
}

${props => props.$isDragActive && css`
  ${DropArea} {
    background-color: color-mix(in hsl, var(--color-green-5), transparent 80%);
  }
`}


`
