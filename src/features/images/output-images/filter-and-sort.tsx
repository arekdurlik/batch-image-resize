import { ChangeEvent } from 'react';
import { MdArrowUpward, MdArrowDownward, MdClose } from 'react-icons/md';
import styled from 'styled-components';
import { Button } from '../../ui/inputs/button';
import { SelectInput } from '../../ui/inputs/select-input';
import { ButtonGroup } from '../../ui/inputs/styled';
import { TextInput } from '../../ui/inputs/text-input';
import { SortOption, SortDirection } from '../types';
import { Tooltip, TooltipContent } from '../../ui/tooltip';

type Props = {
    filter: string;
    sortOption: SortOption;
    sortDirection: SortDirection;
    onFilter?: (value: string) => void;
    onSortOptChange?: (value: SortOption) => void;
    onSortDirChange?: (value: SortDirection) => void;
};

export function FilterAndSort({
    filter,
    sortOption,
    sortDirection,
    onFilter,
    onSortOptChange,
    onSortDirChange,
}: Props) {
    function handleFilterChange(event: ChangeEvent<HTMLInputElement>) {
        onFilter?.(event.target.value as SortOption);
    }

    function handleSortOptionChange(value: string | number) {
        onSortOptChange?.(value as SortOption);
    }

    function handleSortDirectionFlip() {
        onSortDirChange?.(
            sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
        );
    }

    return (
        <>
            <span>Filter by:</span>
            <TextInput
                value={filter}
                onChange={handleFilterChange}
                suffix={filter.length ? <ClearFilter onClick={() => onFilter?.('')} /> : undefined}
                style={{ width: 137 }}
            />
            <span style={{ marginLeft: 8 }}>Sort by:</span>
            <ButtonGroup>
                <SelectInput
                    value={sortOption}
                    onChange={handleSortOptionChange}
                    options={[
                        { label: 'File name', value: SortOption.FILENAME },
                        { label: 'File size', value: SortOption.FILESIZE },
                        { label: 'Variant', value: SortOption.VARIANT },
                    ]}
                    style={{ width: 110 }}
                />
                <Tooltip
                    content={
                        <TooltipContent>
                            {sortDirection === SortDirection.ASC
                                ? 'Sort order (Ascending)'
                                : 'Sort order (Descending)'}
                        </TooltipContent>
                    }
                >
                    <Button onClick={handleSortDirectionFlip}>
                        {sortDirection === SortDirection.ASC ? (
                            <MdArrowUpward />
                        ) : (
                            <MdArrowDownward />
                        )}
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </>
    );
}

const ClearFilter = styled(MdClose)`
    cursor: pointer;
`;
