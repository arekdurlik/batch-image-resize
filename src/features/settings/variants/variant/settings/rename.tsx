import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import { useVariants } from '../../../../../store/variants'
import { TextInput } from '../../../../ui/inputs/text-input'
import styled from 'styled-components'
import { Variant } from '../../../../../store/types'
import { useOutsideClick } from '../../../../../hooks'
import { useDidUpdateEffect } from '../../../../../hooks/use-did-update-effect'
import { outline } from '../../../../../styles/mixins'
import { Tooltip } from '../../../../ui/tooltip'

export function Rename({ variant }: { variant: Variant }) {
  const [editing, setEditing] = useState(false);
  const api = useVariants(state => state.api);
  const labelRef = useRef<HTMLHeadingElement>(null!);
  const titleRef = useRef<HTMLInputElement>(null!);
  const handleFocus = useRef(false);

  useOutsideClick(titleRef, () => setEditing(false));
  useDidUpdateEffect(() => {
    if (editing) {
      titleRef.current.focus();
    } else {
      if (handleFocus.current) {
        handleFocus.current = false;
        labelRef.current.focus();
      }
    }
  }, [editing]);

  function handleRename(event: ChangeEvent<HTMLInputElement>) {
    api.rename(variant.id, event.target.value);
  }

  function handleLabelKey(event: KeyboardEvent) {
    event.stopPropagation();

    switch (event.key) {
      case 'Enter':
      case ' ':
        setEditing(true);
    }
  }

  function handleInputKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        handleFocus.current = true;
        setEditing(false);
    }
  }

  return (
    editing ? (
      <TextInput 
        ref={titleRef} 
        value={variant.name} 
        onChange={handleRename}
        onKeyDown={handleInputKey}
        spellCheck={false}
        onBlur={() => setEditing(false)}
      />
    ) : (
      <Tooltip
        content={
          <Tooltip.Content>
            Double click to edit
          </Tooltip.Content>
        }
      >
        <VariantName
          ref={labelRef}
          tabIndex={0} 
          onKeyDown={handleLabelKey} 
          onDoubleClick={() => setEditing(true)}
        >
          {variant.name}
        </VariantName>
      </Tooltip>
    )
  )
}

const VariantName = styled.h3`
${outline}
outline-offset: 0px;
width: 100%;
border-radius: var(--borderRadius-default);
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
cursor: default;
`