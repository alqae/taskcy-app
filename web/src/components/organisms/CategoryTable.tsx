import React, { useEffect, useMemo, useState } from 'react'
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
import type { Category, PaginatedResponse } from '@types'
import { useModal } from '@/context/ModalContext'
import { useDebounce } from '@/hooks/useDebounce'
import { CategoryModal } from './CategoryModal'
import { useApi } from '@/hooks/useApi'
import { textOn } from '@/utils'

export const CategoryTable: React.FC = () => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Category>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 800)

  const query = useMemo(() => {
    const filters: Record<string, string> = {
      take: rowsPerPage.toString(),
      skip: page.toString(),
      sort_by: orderBy,
      sort_order: order,
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch
    }

    return filters
  }, [page, rowsPerPage, orderBy, order, debouncedSearch])

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

  const { data = {
    hits: [],
    total: 0,
    totalPages: 0,
  }, isLoading, error, refetch } = useApi<PaginatedResponse<Category>>("/categories", {
    method: "GET",
    query,
    skip: true,
  })

  useEffect(() => {
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debouncedSearch])

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
        isLoading={isLoading}
        headCells={headCells}
        rows={data.hits}
        error={error}
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
          refetch()
        }}
        onSortChange={(orderBy, order) => {
          setOrderBy(orderBy)
          setOrder(order)
          refetch()
        }}
        onRefresh={refetch}
        onActionClick={() => { }}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />
    </>
  )
}
