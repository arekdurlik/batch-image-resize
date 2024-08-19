import { MdMoreHoriz } from 'react-icons/md'
import { Button } from '../../ui/inputs/button'
import { Tooltip, TooltipContent } from '../../ui/tooltips'
import { useState } from 'react'

export function MoreOptions() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Tooltip
      enabled={!enabled}
      content={
        <TooltipContent>
          More options
        </TooltipContent>
      }
    >
      <Button style={{ marginLeft: 8 }} onClick={() => setEnabled(!enabled)}>
        <MdMoreHoriz/>
      </Button>
    </Tooltip>
  )
}