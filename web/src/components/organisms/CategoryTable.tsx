import React, { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

import { EnhancedTable, type HeadCell, type Order } from '@/components/molecules/Table'
import { ExpandableSearchBar } from '@/components/atoms/ExpandableSearchBar'
import { useGetCategoriesQuery } from '@store/apis/categoryApi'
import { useModal } from '@/context/ModalContext'
import { useDebounce } from '@/hooks/useDebounce'
import { CategoryModal } from './CategoryModal'
import { handleError, textOn } from '@/utils'
import type { Category } from '@types'

export const CategoryTable: React.FC = () => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Category>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 800)

  const headCells: readonly HeadCell<Category>[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
    },
    {
      id: 'description',
      numeric: true,
      disablePadding: false,
      label: 'Description',
    },
    {
      id: 'color',
      numeric: true,
      disablePadding: false,
      label: 'Color',
    },
  ]

  const categoriesResponse = useGetCategoriesQuery({
    take: rowsPerPage,
    skip: page,
    sort_by: orderBy,
    sort_order: order,
    search: debouncedSearch,
  }, {
    refetchOnMountOrArgChange: true
  })

  const modal = useModal()

  const onEdit = (category: Category) => {
    modal.showModal(CategoryModal, {
      title: 'Edit Category',
      description: 'Please fill in the form below to edit the category.',
      defaultValue: category,
    })
  }

  return (
    <>
      <EnhancedTable
        dense
        isLoading={categoriesResponse.isLoading}
        headCells={headCells}
        rows={categoriesResponse.data?.hits ?? []}
        error={handleError(categoriesResponse.error)}
        title="Categories"
        filters={(
          <Stack direction="row" spacing={1}>
            <ExpandableSearchBar name="category-table-search" value={search} onChange={setSearch} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Export">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        renderRow={(row, _, handleClick, isItemSelected) => {
          const labelId = `category-table-checkbox-${row.id}`

          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              selected={isItemSelected}
              sx={{ cursor: 'pointer' }}
              onClick={() => onEdit(row)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  name={labelId}
                  color="primary"
                  checked={isItemSelected}
                  onChange={() => handleClick(row.id)}
                />
              </TableCell>
              <TableCell component="th" id={labelId} scope="row" align="left">
                {row.name}
              </TableCell>
              <TableCell component="th" id={labelId} scope="row" align="right">
                {row.description}
              </TableCell>
              <TableCell component="th" id={labelId} scope="row" align="right">
                <Chip label={row.color} sx={{ backgroundColor: row.color, color: textOn(row.color) }} />
              </TableCell>
            </TableRow>
          )
        }}
        sort={{ orderBy, order }}
        pagination={{ page, rowsPerPage }}
        onPaginationChange={(page, rowsPerPage) => {
          setRowsPerPage(rowsPerPage)
          setPage(page)
        }}
        onSortChange={(orderBy, order) => {
          setOrderBy(orderBy)
          setOrder(order)
        }}
        onRefresh={categoriesResponse.refetch}
        onActionClick={() => { }}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />
    </>
  )
}
