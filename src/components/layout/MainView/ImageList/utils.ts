import { OnChangeData } from '../../../../hooks/useDragSelect'

export function jumpToItem(container: HTMLElement, item: HTMLElement) {
  const { top: itemTop, bottom: itemBottom } = item.getBoundingClientRect();
  const { top: listTop, bottom: listBottom } = container.getBoundingClientRect();

  const scrollPadding = 20;
  const topDifference = listTop - itemTop;
  const bottomDifference = itemBottom - listBottom;

  const ScrollUpDestination = container.scrollTop - topDifference - scrollPadding;
  const scrollDownDestination = container.scrollTop + bottomDifference + scrollPadding;

  if (topDifference > 0) {
    // scroll up

    const doesntFit = itemBottom < listBottom;
    container.scrollTo({ 
      top: doesntFit ? scrollDownDestination : ScrollUpDestination, 
      behavior: 'smooth' 
    });
  } else if (bottomDifference > 0) {
    // scroll down
    
    container.scrollTo({ 
      top: scrollDownDestination, 
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