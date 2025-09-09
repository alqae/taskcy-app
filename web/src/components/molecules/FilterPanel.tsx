import React, { useCallback, useMemo, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import ListItem from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import Box from '@mui/material/Box'

interface FilterPanelProps {
  title: string
  icon?: React.ReactElement
  columns: {
    label: string
    value: string
  }[]
  value: string[]
  asMenuItem?: boolean
  onChange: (value: string[]) => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  title,
  icon = <FilterAltIcon />,
  columns,
  value: selectedColumns,
  onChange,
  asMenuItem,
}) => {
  const [searchValue, setSearchValue] = useState('')

  const handleShowHideAll = () => {
    const allChecked = selectedColumns.length === columns.length
    if (allChecked) {
      onChange([])
    } else {
      onChange(columns.map(column => column.value))
    }
  }

  const handleReset = () => {
    setSearchValue('')
    onChange([])
  }

  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  }, [])

  const toggleColumn = useCallback((columnValue: string) => {
    if (selectedColumns.includes(columnValue)) {
      onChange(selectedColumns.filter(value => value !== columnValue))
    } else {
      onChange([...selectedColumns, columnValue])
    }
  }, [onChange, selectedColumns])

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? `filter-panel-${title}` : undefined

  const checkAllChecked = useMemo(() => selectedColumns.length === columns.length, [columns, selectedColumns])
  const checkInterdeterminate = useMemo(
    () => selectedColumns.length > 0 && selectedColumns.length < columns.length,
    [selectedColumns, columns]
  )

  return (
    <>
      <Tooltip title={title}>
        {asMenuItem ? (
          <MenuItem dense onClick={handleClick}>
            <IconButton>
              <Badge badgeContent={selectedColumns.length} color="secondary">
                {icon}
              </Badge>
            </IconButton>
            <p>{title}</p>
          </MenuItem>
        ) : (
          <IconButton onClick={handleClick}>
            <Badge badgeContent={selectedColumns.length} color="secondary">
              {icon}
            </Badge>
          </IconButton>
        )}
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
      >
        <Paper variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <InputBase
            fullWidth
            sx={{ p: 2 }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <Divider />

          <List disablePadding sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {columns.map(({ label, value }) => (
              <ListItem key={`${title}-${value}`} disablePadding dense>
                <ListItemButton>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={selectedColumns.includes(value)}
                        onChange={() => toggleColumn(value)}
                      />
                    )}
                    label={label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              label="Show/Hide All"
              control={<Checkbox indeterminate={checkInterdeterminate} checked={checkAllChecked} onChange={handleShowHideAll} />}
            />

            <Button onClick={handleReset} variant="text">Reset</Button>
          </Box>
        </Paper>
      </Popover>
    </>
  )
}
