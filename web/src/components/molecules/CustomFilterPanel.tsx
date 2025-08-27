import React from 'react'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'

interface CustomFilterPanelProps extends React.PropsWithChildren {
  title?: string
  renderLauncher: (toggle: (event: HTMLElement) => void) => React.ReactNode
}

export const CustomFilterPanel: React.FC<CustomFilterPanelProps> = ({ title = 'Filter', renderLauncher, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>()

  const handleClick = (event: HTMLElement) => {
    setAnchorEl(event)
  }

  const handleClose = () => {
    setAnchorEl(undefined)
  }

  const open = Boolean(anchorEl)
  const id = open ? `${title}-popover` : undefined

  return (
    <div>
      {renderLauncher(handleClick)}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2 }}>{children}</Paper>
      </Popover>
    </div>
  )
}
