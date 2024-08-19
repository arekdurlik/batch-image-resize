import { MouseEvent, ReactNode } from 'react'
import { MdCheck } from 'react-icons/md'
import styled from 'styled-components'
import { outline } from '../../../../styles/mixins'

type Props = {
  active?: boolean
  icon?: ReactNode
  label: string
  onClick?: (event: MouseEvent) => void
}

export function Item({ active, icon, label, onClick }: Props) {
  return (
    <Wrapper onClick={onClick} tabIndex={-1}>
      <Check $visible={active}/>
      {icon}
      {label}
    </Wrapper>
  )
}

const Wrapper = styled.div`
display: flex;
padding: var(--spacing-default) var(--spacing-large);
border-radius: var(--borderRadius-default);
align-items: center;
gap: 10px;
${outline}

margin-left: var(--spacing-default);
margin-right: var(--spacing-default);

&:first-child {
  margin-top: var(--spacing-default);
}

&:last-child {
  margin-bottom: var(--spacing-default);
}

&:hover {
  background-color: var(--button-default-bgColor-hover);
}
cursor: pointer;
`
const Check = styled(MdCheck)<{ $visible?: boolean }>`
  opacity: ${props => props.$visible ? 1 : 0};
`