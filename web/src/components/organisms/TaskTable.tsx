import React, { useState, useMemo, useEffect } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import { capitalize } from '@mui/material'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import type { Moment } from 'moment'
import Fab from '@mui/material/Fab'

import { type PaginatedResponse, type Task, TaskPriority, TaskState } from '@types'
import { EnhancedTable, type HeadCell, type Order } from '@/components/molecules/Table'
import { TaskModal } from '@/components/organisms/TaskModal'
import { TaskFilters } from '../molecules/TaskFilters'
import { useDebounce } from '@/hooks/useDebounce'
import { useApi } from '@/hooks/useApi'
import { textOn } from '@/utils'

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

interface TaskTableProps {
  allowedStates?: TaskState[]
  title?: string
  showAddModal?: boolean
}

export const TaskTable: React.FC<TaskTableProps> = ({ allowedStates = [], title = 'Tasks', showAddModal = false }) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Task>('expiryDate')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [search, setSearch] = useState('')

  const [expiryDate, setExpiryDate] = useState<Moment>()

  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([])
  const [selectedStates, setSelectedStates] = useState<TaskState[]>(allowedStates)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const debouncedSearch = useDebounce(search, 800)

  const skipStates = allowedStates.length > 0

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
    ...(skipStates ? [] : [
      {
        id: 'state',
        numeric: true,
        disablePadding: false,
        label: 'State',
      } as HeadCell<Task>,
    ]),
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
        title={title}
        filters={(
          <Stack direction="row" spacing={1}>
            <TaskFilters
              expiryDate={expiryDate}
              onExpiryDateChange={setExpiryDate}
              selectedPriorities={selectedPriorities}
              onSelectedPrioritiesChange={setSelectedPriorities}
              selectedStates={selectedStates}
              onSelectedStatesChange={setSelectedStates}
              selectedCategories={selectedCategories}
              onSelectedCategoriesChange={setSelectedCategories}
              selectedTags={selectedTags}
              onSelectedTagsChange={setSelectedTags}
              search={search}
              onSearchChange={setSearch}
              skipStates={skipStates}
            />

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Export">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        renderRow={(row, _, handleClick, isItemSelected) => {
          const labelId = `task-table-checkbox-${row.id}`

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
                  name={labelId}
                  color="primary"
                  checked={isItemSelected}
                  onChange={() => handleClick(row.id)}
                />
              </TableCell>

              <TaskModal
                onSubmit={refetch}
                task={row}
                renderLauncher={(toggle) => (
                  <>
                    <TableCell component="th" id={labelId} scope="row" padding="none" onClick={toggle}>
                      {row.name}
                    </TableCell>
                    <TableCell align="right" onClick={toggle}>
                      <Chip label={capitalize(row.priority)} color={getColorByPriority(row.priority)} />
                    </TableCell>
                    <TableCell align="right" onClick={toggle}>{row.expiryDate}</TableCell>
                    {!skipStates && (
                      <TableCell align="right" onClick={toggle}>
                        <Chip label={capitalize(row.state.replace('_', ' '))} color={getColorByState(row.state)} />
                      </TableCell>
                    )}
                    <TableCell align="right" onClick={toggle}>
                      <Chip label={row.category.name} sx={{ bgcolor: row.category.color, color: textOn(row.category.color) }} />
                    </TableCell>
                    <TableCell align="right" onClick={toggle}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                        {row.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            sx={{ bgcolor: tag.color, color: textOn(tag.color) }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  </>
                )}
              />
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

      {showAddModal && (
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
      )}
    </>
  )
}
