import styled from 'styled-components';

export function Divider() {
    return (
        <Wrapper>
            <Line />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: var(--spacing-default);
    margin-bottom: var(--spacing-default);
`;
const Line = styled.div`
    height: 1px;
    width: 100%;
    background-color: var(--borderColor-default);
`;
