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
import { useGetTagsQuery } from '@store/apis/tagApi'
import { useDebounce } from '@/hooks/useDebounce'
import { useModal } from '@/context/ModalContext'
import { handleError, textOn } from '@/utils'
import { TagModal } from './TagModal'
import type { Tag } from '@types'

export const TagTable: React.FC = () => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Tag>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 800)

  const headCells: readonly HeadCell<Tag>[] = [
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

  const tagsResponse = useGetTagsQuery({
    take: rowsPerPage,
    skip: page,
    sort_by: orderBy,
    sort_order: order,
    search: debouncedSearch,
  }, {
    refetchOnMountOrArgChange: true
  })

  const modal = useModal()

  const onEdit = (tag: Tag) => {
    modal.showModal(TagModal, {
      title: 'Edit Tag',
      description: 'Please fill in the form below to edit the tag.',
      defaultValue: tag,
    })
  }

  return (
    <>
      <EnhancedTable
        dense
        isLoading={tagsResponse.isLoading}
        headCells={headCells}
        rows={tagsResponse.data?.hits ?? []}
        totalItems={tagsResponse.data?.total ?? 0}
        error={handleError(tagsResponse.error)}
        title="Tags"
        filters={(
          <Stack direction="row" spacing={1}>
            <ExpandableSearchBar name="tag-table-search" value={search} onChange={setSearch} />
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Export">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        renderRow={(row, _, handleClick, isItemSelected) => {
          const labelId = `tag-table-checkbox-${row.id}`

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
        onActionClick={() => { }}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        onRefresh={tagsResponse.refetch}
      />
    </>
  )
}
