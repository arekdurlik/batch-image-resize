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