import { MouseEvent as ReactMouseEvent, RefObject, useEffect, useRef } from 'react'

type Coordinates = {
  x: number
  y: number
};

type DrawnArea = {
  start: undefined | Coordinates
  end: undefined | Coordinates
};

type Options = {
  ignoreChildren?: boolean
  dragThreshold?: number
};

export type OnChangeData = { 
  selected: HTMLElement[]
  added: HTMLElement[]
  removed: HTMLElement[] 
}

const DEFAULT_OPTIONS = {
  ignoreChildren: false,
  dragThreshold: 2
};

export function useDragSelect(
  container: RefObject<HTMLElement>, 
  selectables: HTMLElement[], 
  callbacks: { 
    onStart?: (selected: HTMLElement | undefined) => void,
    onChange?: (data: OnChangeData) => void, 
    onEnd?: (selected: HTMLElement[], dragged: boolean) => void 
  },
  options?: Options
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const boxNode = document.createElement('div');
  boxNode.classList.add('drag-select-box');
  const boxElement = useRef<HTMLDivElement>(boxNode);

  const mouseDown = useRef<false | { x: number, y: number }>(false);
  const dragged = useRef(false);
  const containerStartScrollTop = useRef(0);
  const selectedLength = useRef(0);
  const previousSelected = useRef<HTMLElement[]>([]);
  const drawArea = useRef<DrawnArea>({
    start: undefined,
    end: undefined
  });

  useEffect(() => {
    () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  });

  function getSelectedItems() {
    const boxRect = boxElement.current.getBoundingClientRect();
    return selectables.filter(i => {
      return inSelectorArea(i.getBoundingClientRect(), boxRect);
    });
  }

  function aboveDragThreshold(event: MouseEvent) {
    if (!mouseDown.current) return;
    const { x: startX, y: startY } = mouseDown.current;
    const { clientX: x, clientY: y } = event;
    const xDiff = Math.abs(startX - x);
    const yDiff = Math.abs(startY - y);

    if (xDiff > opts.dragThreshold || yDiff > opts.dragThreshold) {
      return true;
    } else {
      return false;
    }
  }

  function appendBox() {
    if (container.current && !document.body.contains(boxElement.current)) {
      container.current.appendChild(boxElement.current);
    }
  }

  function removeBox() {
    if (container.current && container.current.contains(boxElement.current)) {
      container.current.removeChild(boxElement.current);
    }
  }

  function hideBox() {
    boxElement.current.classList.add('drag-select-box--hidden');
  }
  
  function showBox() {
    boxElement.current.classList.remove('drag-select-box--hidden');
  }

  function handleMouseDown(event: ReactMouseEvent) {
    if (!container.current) return;

    if (opts.ignoreChildren) {
      if (event.target !== container.current) return;
    }
    
    mouseDown.current = { x: event.clientX, y: event.clientY };
    selectedLength.current = -1;
    previousSelected.current = [];

    containerStartScrollTop.current = container.current.scrollTop;
    const bounds = container.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY + containerStartScrollTop.current - bounds.top;

    drawArea.current = {
      start: { x, y },
      end: { x, y }
    };
    
    if (callbacks.onStart) {
      appendBox();
      hideBox();
      drawSelectionBox(boxElement.current, drawArea.current.start!, drawArea.current.end!);
      const selected = getSelectedItems();
      if (selected.length === selectedLength.current) return;
      callbacks.onStart?.(selected[0]);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

  }

  function handleMouseMove(event: MouseEvent) {
    if (!container.current) return;
    
    if (!aboveDragThreshold(event)) return;
    showBox();
    const bounds = container.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    const scrollDiff = container.current.scrollTop - containerStartScrollTop.current;

    drawArea.current = {
      ...drawArea.current,
      end: { x, y: y + containerStartScrollTop.current + scrollDiff }
    };

    drawSelectionBox(boxElement.current, drawArea.current.start!, drawArea.current.end!);
    
    const selected = getSelectedItems();
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
  }

  function handleMouseUp() {
    if (callbacks.onEnd) {
      const boxRect = boxElement.current.getBoundingClientRect();
      const selected = selectables.filter(i => {
        return inSelectorArea(i.getBoundingClientRect(), boxRect);
      });

      const d = drawArea.current;
      if (d.start?.x === d.end?.x && d.start?.y === d.end?.y) {
        dragged.current = false;
      } else {
        dragged.current = true;
      }

      callbacks.onEnd(selected, dragged.current);
    }

    removeBox();

    mouseDown.current = false;
    selectedLength.current = -1;
    previousSelected.current = [];

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  return {
    onMouseDown: handleMouseDown, 
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