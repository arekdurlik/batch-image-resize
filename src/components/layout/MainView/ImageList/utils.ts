import { OnChangeData } from '../../../../hooks/useDragSelect'

export function jumpToItem(container: HTMLElement, item: HTMLElement) {
  const { top: itemTop, bottom: itemBottom } = item.getBoundingClientRect();
  const { top: listTop, bottom: listBottom } = container.getBoundingClientRect();

  const scrollPadding = 20;
  const topDifference = listTop - itemTop;
  const bottomDifference = itemBottom - listBottom;

  if (topDifference > 0) {
    container.scrollTo({ 
      top: container.scrollTop - topDifference - scrollPadding, 
      behavior: 'smooth' 
    });
  } else if (bottomDifference > 0) {
    container.scrollTo({ 
      top: container.scrollTop + bottomDifference + scrollPadding, 
      behavior: 'smooth' 
    });
  }
}

export function toSelectedItems(data: OnChangeData, type: 'input' | 'output') {
  return {
    selected: data.selected.map(i => ({ type, id: i.dataset.id! })),
    added: data.added.map(i => ({ type, id: i.dataset.id! })),
    removed: data.removed.map(i => ({ type, id: i.dataset.id! })),
  }
}