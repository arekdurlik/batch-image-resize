import styled from 'styled-components'

export const AppWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  padding: 0 10px;
  height: 50px;
  border-bottom: 1px solid var(--borderColor-default);
  pointer-events: none;

* {
  pointer-events: initial;
}
`

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  margin-top: -5px;
  margin-bottom: -5px;
`

export const SideBarSection = styled.div<{ $animate?: boolean }>`
  display: flex;
  flex-direction: column;
`

export const SectionGroup = styled.div`
  padding: 10px;
  border-bottom: 1px solid var(--borderColor-default);
`