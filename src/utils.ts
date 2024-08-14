import { SelectedItem } from './store/types'

export function mergeUniqueSelectionItems(arr1: SelectedItem[], arr2: SelectedItem[]) {
  const uniqueToArr1 = arr1.filter(item => arr2.find(i => i.id === item.id) === undefined);
  const uniqueToArr2 = arr2.filter(item => arr1.find(i => i.id === item.id) === undefined);
  
  return uniqueToArr1.concat(uniqueToArr2);
}