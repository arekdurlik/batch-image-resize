export type Props = {
  label?: string
  value: string | number
  options: Option[]
  rightAligned?: boolean
  onChange: (value: string | number) => void
};

export type Option = {
  label: string
  value: string | number
};


export enum Placement {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM'
}