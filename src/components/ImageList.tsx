import styled from 'styled-components'
import { useAppStore } from '../store/appStore'

export function ImageList() {
  const { images } = useAppStore()

  return <List>
    <tbody>
    {images.map((image, i) => {
      return <Item key={i}>
        <Data style={{ width: 100 }}>
          <Thumbnail src={URL.createObjectURL(image.file)}/>
        </Data>
        <Data>
        <b>File name:</b>{image.file.name}
        </Data>
        <Data>
          {image.width}X{image.height}
        </Data>
      </Item>
    })}
    </tbody>
  </List>
}

const Thumbnail = styled.img`
max-height: 50px;
width: 100px;
object-fit: cover;
overflow-clip-margin: unset;
`

const List = styled.table`
height: max-content;
width: 100%;
`

const Item = styled.tr`
padding: 10px;
align-items: center;
gap: 10px;
width: 100%;
border-bottom: 1px solid ${props => props.theme.border};
`

const Data = styled.td`

`