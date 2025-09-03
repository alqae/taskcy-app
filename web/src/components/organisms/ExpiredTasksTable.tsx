import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import { Task, Category, Tag, User, TaskState, TaskPriority } from '@types'
import { EnhancedTable, type Order } from '@/components/molecules/Table'
import { TaskModal } from '@/components/organisms/TaskModal'

const examples = {
  categories: [
    new Category(1, "Work", "Work related tasks", "#FF0000"),
    new Category(2, "Personal", "Personal tasks", "#00FF00"),
    new Category(3, "Study", "Study related tasks", "#0000FF"),
  ],
  tags: [
    new Tag(1, "Urgent", "Needs immediate attention", "#FF8800"),
    new Tag(2, "Review", "Needs review", "#0088FF"),
    new Tag(3, "Optional", "Low importance", "#888888"),
  ],
  users: [
    new User(1, "Alice", "Smith", "alice@example.com", 1),
    new User(2, "Bob", "Johnson", "bob@example.com", 2),
    new User(3, "Charlie", "Brown", "charlie@example.com", 3),
  ],
}

const randomElement = <T, >(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

const generateData = (length = 5): Task[] => {
  const states = [TaskState.TODO, TaskState.IN_PROGRESS, TaskState.COMPLETED]
  const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]

  return Array.from({ length }, (_, i) => {
    return new Task(
      i + 1,
      `Task ${i + 1}`,
      `This is a dummy description for task ${i + 1}`,
      randomElement(examples.categories),
      [randomElement(examples.tags)],
      randomElement(examples.users),
      randomElement(states),
      new Date(
        Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      randomElement(priorities),
      `${Math.floor(Math.random() * 5) + 1}d`
    )
  })
}

export const ExpiredTasksTable: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Task>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <EnhancedTable<Task>
      dense
      isLoading={isLoading}
      title="Tasks expiring today"
      headCells={[
        { id: 'name', label: 'Name', disablePadding: false, numeric: false },
        { id: 'duration', label: 'Duration', disablePadding: false, numeric: true },
        { id: 'priority', label: 'Priority', disablePadding: false, numeric: true },
        { id: 'category', label: 'Category', disablePadding: false, numeric: true },
        { id: 'tags', label: 'Tags', disablePadding: false, numeric: true },
      ]}
      rows={generateData()}
      renderRow={(row, _, handleClick, isItemSelected) => {
        const labelId = `expired-tasks-table-checkbox-${row.id}`

        return (
          <TableRow sx={{ cursor: 'pointer' }} key={row.id}>
            <TableCell padding="checkbox">
              <Checkbox
                name={labelId}
                color="primary"
                checked={isItemSelected}
                onChange={() => handleClick(row.id)}
              />
            </TableCell>

            <TaskModal
              onSubmit={() => { }}
              task={row}
              renderLauncher={(toggle) => (
                <>
                  <TableCell onClick={toggle} align="left">{row.name}</TableCell>
                  <TableCell onClick={toggle} align="right">{row.duration}</TableCell>
                  <TableCell onClick={toggle} align="right">{row.priority}</TableCell>
                  <TableCell onClick={toggle} align="right">{row.category.name}</TableCell>
                  <TableCell onClick={toggle} align="right">{row.tags.map((tag) => tag.name).join(', ')}</TableCell>
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
      }}
      onSortChange={(orderBy, order) => {
        setOrderBy(orderBy)
        setOrder(order)
      }}
      onActionClick={() => { }}
      selectedIds={selectedIds}
      onSelectedIdsChange={setSelectedIds}
    />
  )
}
