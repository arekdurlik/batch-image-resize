import { useAppStore } from '../../store/appStore'
import { DropZone } from '../dropZone'
import { ImageList } from '../imageList'

export function MainView() {
  const { images } = useAppStore()

  return images.length ? <ImageList/> : <DropZone/>
}