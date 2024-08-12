import { OnChangeData } from '../../../../hooks/useDragSelect'

export function jumpToElement(container: HTMLElement, element: HTMLElement) {
  const { top: elTop, bottom: elBottom } = element.getBoundingClientRect();
  const { top: boxTop, bottom: boxBottom } = container.getBoundingClientRect();

  const scrollPadding = 20;
  const topDifference = boxTop - elTop;
  const bottomDifference = elBottom - boxBottom;

  if (topDifference > 0) {
    // scroll up

    const ScrollUpDestination = container.scrollTop - topDifference - scrollPadding;
    container.scrollTo({ 
      top: ScrollUpDestination, 
      behavior: 'smooth' 
    });
  } else if (bottomDifference > 0) {
    // scroll down
    
    const scrollDownDestination = container.scrollTop + bottomDifference + scrollPadding;
    container.scrollTo({ 
      top: scrollDownDestination, 
      behavior: 'smooth' 
    });
  }
}

export function toSelectedItems(data: HTMLElement[], type: 'input' | 'output') {
  return data.map(i => ({ type, id: i.dataset.id! }));
}

export function allToSelectedItems(data: OnChangeData, type: 'input' | 'output') {
  return {
    selected: toSelectedItems(data.selected, type),
    added: toSelectedItems(data.added, type),
    removed: toSelectedItems(data.removed, type),
  }
}