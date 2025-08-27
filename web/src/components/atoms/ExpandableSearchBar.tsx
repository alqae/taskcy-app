import React from 'react'
import Paper from '@mui/material/Paper'
import Collapse from '@mui/material/Collapse'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

interface ExpandableSearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const ExpandableSearchBar: React.FC<ExpandableSearchBarProps> = ({ placeholder = 'Search...', value, onChange }) => {
  const [searchExpanded, setSearchExpanded] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Paper
    component="form"
    variant="outlined"
    sx={{
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      ...!searchExpanded && { border: 'none' }
    }}
  >
    <IconButton aria-label="menu" onClick={() => setSearchExpanded((prev) => !prev)}>
      <SearchIcon />
    </IconButton>

    <Collapse orientation="horizontal" in={searchExpanded} onEntered={() => searchInputRef.current?.focus()}>
      <InputBase
        sx={{ width: 200 }}
        value={value}
        placeholder={placeholder}
        inputProps={{ ref: searchInputRef }}
        inputMode="search"
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => value.length === 0 && setSearchExpanded(false)}
      />
    </Collapse>
  </Paper>
  )
}
