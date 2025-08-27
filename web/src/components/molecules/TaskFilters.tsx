import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CategoryIcon from '@mui/icons-material/Category'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import TodayIcon from '@mui/icons-material/Today'
import { useMediaQuery } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import Menu from '@mui/material/Menu'
import type { Moment } from 'moment'

import { ExpandableSearchBar } from '@/components/atoms/ExpandableSearchBar'
import { CustomFilterPanel } from '@/components/molecules/CustomFilterPanel'
import { FilterPanel } from '@/components/molecules/FilterPanel'
import { TaskPriority, TaskState, ItemOption } from '@types'
import { useApi, type ApiState } from '@/hooks/useApi'

interface TaskFiltersProps {
  expiryDate?: Moment
  onExpiryDateChange: (date?: Moment) => void
  selectedPriorities: TaskPriority[]
  onSelectedPrioritiesChange: (priorities: TaskPriority[]) => void
  selectedStates: TaskState[]
  onSelectedStatesChange: (states: TaskState[]) => void
  selectedCategories: string[]
  onSelectedCategoriesChange: (categories: string[]) => void
  selectedTags: string[]
  onSelectedTagsChange: (tags: string[]) => void
  skipStates?: boolean
  search: string
  onSearchChange: (search: string) => void
}

export const TaskFilters: React.FC<TaskFiltersProps> = (props) => {
  const categoriesResponse = useApi<ItemOption[]>('/categories/options')
  const tagsResponse = useApi<ItemOption[]>('/tags/options')

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const Component: React.ElementType = isMobile ? MobileTaskFilters : DesktopTaskFilters
  return <Component {...props} categoriesResponse={categoriesResponse} tagsResponse={tagsResponse} />
}

interface FilterPropsWithResponses extends TaskFiltersProps {
  categoriesResponse: ApiState<ItemOption[], unknown>
  tagsResponse: ApiState<ItemOption[], unknown>
}

const DesktopTaskFilters: React.FC<FilterPropsWithResponses> = ({
  categoriesResponse,
  tagsResponse,
  expiryDate,
  onExpiryDateChange,
  selectedPriorities,
  onSelectedPrioritiesChange,
  selectedStates,
  onSelectedStatesChange,
  selectedCategories,
  onSelectedCategoriesChange,
  selectedTags,
  onSelectedTagsChange,
  skipStates,
  search,
  onSearchChange,
}) => {
  return (
    <>
      <CustomFilterPanel
        renderLauncher={(toggle) => (
          <Tooltip title="Expiry Date">
            <IconButton onClick={(e) => toggle(e.currentTarget)}>
              <Badge color="secondary" variant="dot" invisible={!expiryDate}>
                <TodayIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}
      >
        <Stack justifyContent="end" spacing={1}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              autoFocus
              label="Expiry Date"
              value={expiryDate ?? null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                },
              }}
              onChange={(value) => value && onExpiryDateChange(value)}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            onClick={() => onExpiryDateChange(undefined)}
            sx={{ display: expiryDate ? 'block' : 'none' }}
          >
            Clear
          </Button>
        </Stack>
      </CustomFilterPanel>

      <FilterPanel
        icon={<PriorityHighIcon />}
        title="Priority"
        columns={[
          { label: 'Low', value: TaskPriority.LOW },
          { label: 'Medium', value: TaskPriority.MEDIUM },
          { label: 'High', value: TaskPriority.HIGH },
        ]}
        value={selectedPriorities}
        onChange={(value) => onSelectedPrioritiesChange(value as TaskPriority[])}
      />

      {!skipStates && (
        <FilterPanel
          icon={<MonitorHeartIcon />}
          title="State"
          columns={[
            { label: 'Todo', value: TaskState.TODO },
          { label: 'In Progress', value: TaskState.IN_PROGRESS },
          { label: 'Completed', value: TaskState.COMPLETED },
        ]}
        value={selectedStates}
        onChange={(value) => onSelectedStatesChange(value as TaskState[])}
      />
      )}

      <FilterPanel
        icon={<CategoryIcon />}
        title="Category"
        columns={categoriesResponse.data || []}
        value={selectedCategories}
        onChange={(value) => onSelectedCategoriesChange(value as string[])}
      />

      <FilterPanel
        icon={<LocalOfferIcon />}
        title="Tags"
        columns={tagsResponse.data || []}
        value={selectedTags}
        onChange={(value) => onSelectedTagsChange(value as string[])}
      />

      <ExpandableSearchBar name="task-filter-search" value={search} onChange={onSearchChange} />
    </>
  )
}

const MobileTaskFilters: React.FC<FilterPropsWithResponses> = ({
  categoriesResponse,
  tagsResponse,
  expiryDate,
  onExpiryDateChange,
  selectedPriorities,
  onSelectedPrioritiesChange,
  selectedStates,
  onSelectedStatesChange,
  selectedCategories,
  onSelectedCategoriesChange,
  selectedTags,
  onSelectedTagsChange,
  skipStates,
}) => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<HTMLElement>()
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(undefined)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'task-table-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <CustomFilterPanel
        renderLauncher={(toggle) => (
          <Tooltip title="Expiry Date">
            <MenuItem dense>
              <IconButton onClick={(e) => toggle(e.currentTarget)}>
                <Badge color="secondary" variant="dot" invisible={!expiryDate}>
                  <TodayIcon />
                </Badge>
              </IconButton>
              <div>Expiry Date</div>
            </MenuItem>
          </Tooltip>
        )}
      >
        <Stack justifyContent="end" spacing={1}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              autoFocus
              label="Expiry Date"
              value={expiryDate ?? null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                },
              }}
              onChange={(value) => value && onExpiryDateChange(value)}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            onClick={() => onExpiryDateChange(undefined)}
            sx={{ display: expiryDate ? 'block' : 'none' }}
          >
            Clear
          </Button>
        </Stack>
      </CustomFilterPanel>

      <FilterPanel
        asMenuItem
        icon={<PriorityHighIcon />}
        title="Priority"
        columns={[
          { label: 'Low', value: TaskPriority.LOW },
          { label: 'Medium', value: TaskPriority.MEDIUM },
          { label: 'High', value: TaskPriority.HIGH },
        ]}
        value={selectedPriorities}
        onChange={(value) => onSelectedPrioritiesChange(value as TaskPriority[])}
      />

      {!skipStates && (
        <FilterPanel
          asMenuItem
          icon={<MonitorHeartIcon />}
          title="State"
          columns={[
            { label: 'Todo', value: TaskState.TODO },
            { label: 'In Progress', value: TaskState.IN_PROGRESS },
            { label: 'Completed', value: TaskState.COMPLETED },
          ]}
          value={selectedStates}
          onChange={(value) => onSelectedStatesChange(value as TaskState[])}
        />
      )}

      <FilterPanel
        asMenuItem
        icon={<CategoryIcon />}
        title="Category"
        columns={categoriesResponse.data || []}
        value={selectedCategories}
        onChange={(value) => onSelectedCategoriesChange(value as string[])}
      />

      <FilterPanel
        asMenuItem
        icon={<LocalOfferIcon />}
        title="Tags"
        columns={tagsResponse.data || []}
        value={selectedTags}
        onChange={(value) => onSelectedTagsChange(value as string[])}
      />
    </Menu>
  )

  return (
    <>
      <IconButton
        size="large"
        aria-label="show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
        color="inherit"
      >
        <MoreVertIcon />
      </IconButton>
      {renderMobileMenu}
    </>
  )
}
