import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React, { useState, useMemo, useEffect } from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import DownloadIcon from '@mui/icons-material/Download'
import CategoryIcon from '@mui/icons-material/Category'
import TodayIcon from '@mui/icons-material/Today'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import { capitalize } from '@mui/material'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import type { Moment } from 'moment'


import { ItemOption, type PaginatedResponse, type Task, TaskPriority, TaskState } from '@types'
import { EnhancedTable, type HeadCell, type Order } from '@/components/molecules/Table'
import { ExpandableSearchBar } from '@/components/atoms/ExpandableSearchBar'
import { CustomFilterPanel } from '@/components/molecules/CustomFilterPanel'
import { FilterPanel } from '@/components/molecules/FilterPanel'
import { TaskModal } from '@/components/organisms/TaskModal'
import { useDebounce } from '@/hooks/useDebounce'
import { useApi } from '@/hooks/useApi'

const headCells: readonly HeadCell<Task>[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'priority',
    numeric: true,
    disablePadding: false,
    label: 'Priority',
  },
  {
    id: 'expiryDate',
    numeric: true,
    disablePadding: false,
    label: 'Expiry Date',
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'State',
  },
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'tags',
    numeric: true,
    disablePadding: false,
    label: 'Tags',
  },
]

export const TaskTable: React.FC = () => {
  const categoriesResponse = useApi<ItemOption[]>('/categories/options')
  const tagsResponse = useApi<ItemOption[]>('/tags/options')

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Task>('expiryDate')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const getColorByState = (state: TaskState) => {
    switch (state) {
      case TaskState.TODO:
        return 'info'
      case TaskState.IN_PROGRESS:
        return 'warning'
      case TaskState.COMPLETED:
        return 'success'
    }
  }

  const getColorByPriority = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'info'
      case TaskPriority.MEDIUM:
        return 'warning'
      case TaskPriority.HIGH:
        return 'error'
    }
  }

  const [search, setSearch] = useState('')

  const [expiryDate, setExpiryDate] = useState<Moment>()

  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedStates, setSelectedStates] = useState<TaskState[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const debouncedSearch = useDebounce(search, 800);

  const query = useMemo(() => {
    const filters: Record<string, string> = {
      take: rowsPerPage.toString(),
      skip: page.toString(),
      sort_by: orderBy,
      sort_order: order,
    }

    if (expiryDate) {
      filters.expiry_date = expiryDate.format('YYYY-MM-DD')
    }

    if (selectedPriorities.length > 0) {
      filters.priorities = selectedPriorities.join(',')
    }

    if (selectedStates.length > 0) {
      filters.states = selectedStates.join(',')
    }

    if (selectedCategories.length > 0) {
      filters.category_id = selectedCategories.join(',')
    }

    if (selectedTags.length > 0) {
      filters.tags_ids = selectedTags.join(',')
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch
    }

    return filters
  }, [expiryDate, selectedPriorities, selectedStates, selectedCategories, selectedTags, page, rowsPerPage, orderBy, order, debouncedSearch])

  const { data = {
    hits: [],
    total: 0,
    totalPages: 0,
  }, isLoading, error, refetch } = useApi<PaginatedResponse<Task>>("/tasks", {
    method: "GET",
    query,
    skip: true,
  })

  useEffect(() => {
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debouncedSearch])

  return (
    <>
      <EnhancedTable
        dense
        isLoading={isLoading}
        headCells={headCells}
        rows={data.hits}
        error={error}
        title="Tasks"
        filters={(
          <Stack direction="row" spacing={1}>
            <CustomFilterPanel
              renderLauncher={(toggle) => (
                <Tooltip title="Filter">
                  <IconButton onClick={toggle}>
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
                    onChange={(value) => value && setExpiryDate(value)}
                  />
                </LocalizationProvider>

                <Button
                  variant="contained"
                  onClick={() => setExpiryDate(undefined)}
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
              onChange={(value) => setSelectedPriorities(value as TaskPriority[])}
            />

            <FilterPanel
              icon={<MonitorHeartIcon />}
              title="State"
              columns={[
                { label: 'Todo', value: TaskState.TODO },
                { label: 'In Progress', value: TaskState.IN_PROGRESS },
                { label: 'Completed', value: TaskState.COMPLETED },
              ]}
              value={selectedStates}
              onChange={(value) => setSelectedStates(value as TaskState[])}
            />

            <FilterPanel
              icon={<CategoryIcon />}
              title="Category"
              columns={categoriesResponse.data || []}
              value={selectedCategories}
              onChange={(value) => setSelectedCategories(value as string[])}
            />

            <FilterPanel
              icon={<LocalOfferIcon />}
              title="Tags"
              columns={tagsResponse.data || []}
              value={selectedTags}
              onChange={(value) => setSelectedTags(value as string[])}
            />

            <Divider orientation="vertical" flexItem />
            <Tooltip title="Export">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <ExpandableSearchBar value={search} onChange={setSearch} />
          </Stack>
        )}
        renderRow={(row, index, handleClick, isItemSelected) => {
          const labelId = `task-table-checkbox-${index}`

          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              selected={isItemSelected}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  onChange={() => handleClick(row.id)}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </TableCell>
              <TableCell component="th" id={labelId} scope="row" padding="none">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <Chip label={capitalize(row.priority)} color={getColorByPriority(row.priority)} />
              </TableCell>
              <TableCell align="right">{row.expiryDate}</TableCell>
              <TableCell align="right">
                <Chip label={capitalize(row.state.replace('_', ' '))} color={getColorByState(row.state)} />
              </TableCell>
              <TableCell align="right">
                <Chip label={row.category?.name || 'No Category'} color="default" />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                  {row.tags.map((tag) => <Chip key={tag.id} label={tag.name} color="default" />)}
                </Stack>
              </TableCell>
            </TableRow>
          )
        }}
        sort={{ orderBy, order }}
        pagination={{ page, rowsPerPage }}
        onPaginationChange={(page, rowsPerPage) => {
          setRowsPerPage(rowsPerPage)
          setPage(page)
          refetch()
        }}
        onSortChange={(orderBy, order) => {
          setOrderBy(orderBy)
          setOrder(order)
          refetch()
        }}
        onRefresh={refetch}
      />

      <TaskModal
        onSubmit={refetch}
        renderLauncher={(toggle) => (
          <Fab
            color="primary"
            variant="extended"
            onClick={toggle}
            sx={{ position: 'fixed', bottom: { xs: 16, sm: 32 }, right: { xs: 16, sm: 32 } }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        )}
      />
    </>
  )
}
