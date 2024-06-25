import { useAppStore } from '../store/appStore'
import { DropZone } from './DropZone'
import { ImageList } from './ImageList'

export function MainView() {
  const { images } = useAppStore()

  return images.length ? <ImageList/> : <DropZone/>
}