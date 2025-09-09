import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableContainer from '@mui/material/TableContainer'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import Skeleton from '@mui/material/Skeleton'
import { alpha } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Box from '@mui/material/Box'
import React from 'react'

import { EmptyState } from './EmptyState'

export type Order = 'asc' | 'desc'

export interface HeadCell<T> {
  disablePadding: boolean
  id: keyof T
  label: string
  numeric: boolean
}

export interface EnhancedTableHeadProps<T> {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: keyof T
  rowCount: number
  headCells: readonly HeadCell<T>[]
}

export const EnhancedTableHead = <T,>({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  headCells
}: EnhancedTableHeadProps<T>) => {
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              name: 'select-all',
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export interface EnhancedTableToolbarProps {
  numSelected: number
  title?: string
  filters?: React.ReactNode
  actionIcon?: React.ElementType
  onActionClick: () => void
}

export const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  numSelected,
  title,
  filters,
  actionIcon: ActionIcon = DeleteIcon,
  onActionClick,
}) => (
  <Toolbar
    sx={[
      {
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      },
      numSelected > 0 && {
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      },
    ]}
  >
    {numSelected > 0 ? (
      <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>
    ) : (
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h5"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
    )}

    {numSelected > 0 ? (
      <Tooltip title="Delete">
        <IconButton onClick={onActionClick}>
          <ActionIcon />
        </IconButton>
      </Tooltip>
    ) : filters}
  </Toolbar>
)

export interface EnhancedTableProps<T> {
  headCells: readonly HeadCell<T>[]
  rows: readonly T[]
  renderRow: (row: T, index: number, handleClick: (id: number) => void, isSelected: boolean) => React.ReactNode
  dense?: boolean
  title?: string
  onSortChange: (orderBy: keyof T, order: Order) => void
  sort: { orderBy: keyof T, order: Order }
  pagination: { page: number, rowsPerPage: number }
  onPaginationChange: (page: number, rowsPerPage: number) => void
  isLoading?: boolean
  error?: string
  onRefresh?: () => void

  // EnhancedTableToolbar props
  filters?: EnhancedTableToolbarProps['filters']
  actionIcon?: EnhancedTableToolbarProps['actionIcon']
  onActionClick: (selectedIds: number[]) => void

  // EnhancedTable props
  selectedIds: number[]
  onSelectedIdsChange: (selectedIds: number[]) => void
  totalItems: number
}

export const EnhancedTable = <T extends { id: number }>({
  headCells,
  rows,
  renderRow,
  dense = false,
  title,
  onSortChange,
  onPaginationChange,
  sort,
  pagination,
  isLoading,
  error,
  onRefresh,
  // EnhancedTableToolbar props
  filters,
  actionIcon,
  onActionClick,
  // EnhancedTable props
  selectedIds,
  onSelectedIdsChange,
  totalItems
}: EnhancedTableProps<T>) => {
  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = sort.orderBy === property && sort.order === 'asc'
    onSortChange(property, isAsc ? 'desc' : 'asc')
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      onSelectedIdsChange(newSelected)
    } else {
      onSelectedIdsChange([])
    }
  }

  const handleClick = (id: number) => {
    const selectedIndex = selectedIds.indexOf(id)
    let newSelected: number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1))
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      )
    }
    onSelectedIdsChange(newSelected)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    onPaginationChange(newPage, pagination.rowsPerPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    onPaginationChange(0, newRowsPerPage)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selectedIds.length}
          title={title}
          filters={filters}
          actionIcon={actionIcon}
          onActionClick={() => onActionClick(selectedIds)}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selectedIds.length}
              order={sort.order}
              orderBy={sort.orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {isLoading ? (
                Array.from({ length: pagination.rowsPerPage }).map((_, index) => (
                  <TableRow key={`skeleton-row-${index}`}>
                    {Array.from({ length: headCells.length + 1 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="rectangular" height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                error ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length + 1}>
                      <EmptyState
                        title="Error"
                        subtitle="An error occurred while loading the data"
                        icon={WarningAmberIcon}
                        showActions
                        borderLess
                        onAction={onRefresh}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headCells.length + 1}>
                        <EmptyState
                          title="No data"
                          subtitle="When you have data, they'll appear here"
                          showActions
                          borderLess
                          onAction={onRefresh}
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => renderRow(row, index, handleClick, selectedIds.includes(row.id)))
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
