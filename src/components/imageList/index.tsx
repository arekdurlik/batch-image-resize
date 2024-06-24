import { useAppStore } from '../../store/appStore'

export function ImageList() {
  const { images } = useAppStore()

  return <ul>
    <li>image 1</li>
    <li>image 2</li>
  </ul>
}