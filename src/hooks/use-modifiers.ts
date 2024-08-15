import { useKeyboardInputRef } from './use-keyboard-input'

export function useModifiersRef() {
  const keyboard = useKeyboardInputRef(['tab', 'control', 'shift']);

  return {
    get tab() { return keyboard.current.tab },
    get control() { return keyboard.current.control },
    get shift() { return keyboard.current.shift },
    get none() {
      return !keyboard.current.tab && !keyboard.current.control && !keyboard.current.shift;
    }
  }
}