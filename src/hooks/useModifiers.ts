import { useKeyboardInputRef } from './useKeyboardInput'

export function useModifiersRef() {
  const keyboard = useKeyboardInputRef(['tab', 'control', 'shift']);

  return {
    get tab() { return keyboard.current.tab },
    get control() { return keyboard.current.control },
    get shift() { return keyboard.current.shift },
  }
}