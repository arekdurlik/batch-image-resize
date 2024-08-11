import { MouseEvent, RefObject, useRef } from 'react'

type Coordinates = {
  x: number
  y: number
};

type DrawnArea = {
  start: undefined | Coordinates
  end: undefined | Coordinates
};

export type OnChangeData = { 
  selected: HTMLElement[], 
  added: HTMLElement[], 
  removed: HTMLElement[] 
}

export function useDragSelect(
  container: RefObject<HTMLElement>, 
  selectables: HTMLElement[], 
  callbacks: { 
    onStart?: () => void,
    onChange?: (data: OnChangeData) => void, 
    onCancel?: () => void 
  }
) {
  const boxNode = document.createElement('div');
  boxNode.classList.add('drag-select-box');
  const boxElement = useRef<HTMLDivElement>(boxNode);

  const mouseDown = useRef(false);
  const containerStartScrollTop = useRef(0);
  const selectedLength = useRef(0);
  const previousSelected = useRef<HTMLElement[]>([]);
  const drawArea = useRef<DrawnArea>({
    start: undefined,
    end: undefined
  });

  const handleMouseUp = () => {
    const containerElement = container.current;
    const selectionBoxElement = boxElement.current;

    if (containerElement && selectionBoxElement) {
      if (containerElement.contains(selectionBoxElement)) {
        containerElement.removeChild(selectionBoxElement);
      }
    }

    mouseDown.current = false;
    selectedLength.current = -1;
    previousSelected.current = [];

    document.removeEventListener('mouseup', handleMouseUp);

    const d = drawArea.current;
    if (d.start?.x === d.end?.x && d.start?.y === d.end?.y) {
      callbacks.onCancel?.();
    }
  }

  return {
    onMouseDown: (event: MouseEvent) => {
      const containerElement = container.current;
      
      if (!containerElement) return;
      if (event.target !== containerElement) return;
      
      mouseDown.current = true;
      selectedLength.current = -1;
      previousSelected.current = [];

      containerStartScrollTop.current = containerElement.scrollTop;
      const bounds = containerElement.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY + containerStartScrollTop.current - bounds.top;

      drawArea.current = {
        start: { x, y },
        end: { x, y }
      };

      drawSelectionBox(boxElement.current, drawArea.current.start!, drawArea.current.end!);
      const selectionBoxElement = boxElement.current;
      if (!document.body.contains(selectionBoxElement)) {
        containerElement.appendChild(selectionBoxElement);
      }

      document.addEventListener('mouseup', handleMouseUp);

      callbacks.onStart?.();
    }, 
    onMouseMove: (event: MouseEvent) => {
      if (!mouseDown.current) return;

      const containerElement = container.current;

      if (!containerElement) return;

      const bounds = containerElement.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const scrollDiff = containerElement.scrollTop - containerStartScrollTop.current;

      drawArea.current = {
        ...drawArea.current,
        end: { x, y: y + containerStartScrollTop.current + scrollDiff }
      };

      drawSelectionBox(boxElement.current, drawArea.current.start!, drawArea.current.end!);
      const boxRect = boxElement.current.getBoundingClientRect();

      const selected = selectables.filter(i => {
        return inSelectorArea(i.getBoundingClientRect(), boxRect);
      });

      const added = selected.filter(i => !previousSelected.current.includes(i));
      const removed = previousSelected.current.filter(i => !selected.includes(i));

      if (selected.length === selectedLength.current) return;
      selectedLength.current = selected.length;
      
      callbacks.onChange?.({
        selected,
        added,
        removed
    });
      
      previousSelected.current = selected;
    },
  }
} 

function drawSelectionBox(
  boxElement: HTMLElement,
  start: Coordinates,
  end: Coordinates
): void {
  const b = boxElement;
  if (end.x > start.x) {
    b.style.left = start.x + 'px';
    b.style.width = end.x - start.x + 'px';
  } else {
    b.style.left = end.x + 'px';
    b.style.width = start.x - end.x + 'px';
  }

  if (end.y > start.y) {
    b.style.top = start.y + 'px';
    b.style.height = end.y - start.y + 'px';
  } else {
    b.style.top = end.y + 'px';
    b.style.height = start.y - end.y + 'px';
  }
}

function inSelectorArea(item: DOMRect, area: DOMRect) {
  if (item.bottom > area.top 
    && item.right > area.left 
    && item.top < area.bottom 
    && item.left < area.right) {
      return true;
    } else {
      return false;
    }
}