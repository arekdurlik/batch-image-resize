import { css } from 'styled-components'

export const scrollbar = css`
&::-webkit-scrollbar {
  background-color: transparent;
}

&::-webkit-scrollbar-track {
  background-color: #efefef;
}

&::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
    border: 0.2vw solid #eee;
    transition: background-color var(--transition-default);
    
    &:hover {
      background-color: #aaa;
    }

    &:active {
      background-color: #999;
    }
}
`