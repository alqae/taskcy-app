import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import LinearProgress from '@mui/material/LinearProgress'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormControl from '@mui/material/FormControl'
import React, { Suspense, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import moment from 'moment'
import * as yup from 'yup'

import { ItemOption, Task, TaskPriority, TaskState } from '@types'
import { MultiListBox, ListBox } from './ListBox'
import { useApi } from '@/hooks/useApi'

const Editor = React.lazy(() => import('@/components/organisms/Editor'))

const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  expiryDate: yup.date().required('Expiry Date is required'),
  duration: yup.string()
    .required('Duration is required')
    .matches(/^[0-9]+[dhm]$/, { message: 'Duration must be in format 1d, 4h, 1m' }),
  priority: yup.string().required('Priority is required'),
  state: yup.string().required('State is required'),
  categoryId: yup.number().required('Category is required'),
  tagIds: yup.array().min(1, 'Tags are required').required('Tags are required'),
})

interface TaskFormProps {
  defaultValue?: Task // Update/Create mode
  isLoading: boolean
  onCancel: () => void
  onSubmit: (data: yup.InferType<typeof schema>) => void
}

// This component will have three modes: create (default), update (defaultValue), and view (readonly)
export const TaskForm: React.FC<TaskFormProps> = ({ defaultValue, isLoading, onCancel, onSubmit }) => {
  const categoriesResponse = useApi<ItemOption[]>('/categories/options')
  const tagsResponse = useApi<ItemOption[]>('/tags/options')

  // const isEditing = !!defaultValue
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValue?.name ?? '',
      expiryDate: defaultValue?.expiryDate ? moment(defaultValue.expiryDate).toDate() : undefined,
      description: defaultValue?.description ?? '',
      duration: defaultValue?.duration ?? '',
      priority: defaultValue?.priority ?? TaskPriority.LOW,
      state: defaultValue?.state ?? TaskState.TODO,
      categoryId: defaultValue ? defaultValue!.category!.id : undefined,
      tagIds: defaultValue ? defaultValue.tags.map((tag) => tag.id) : [],
    },
    mode: 'all',
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    onSubmit(data)
  }

  const expiryDate = form.watch('expiryDate')
  const formattedExpiryDate = expiryDate ? moment(expiryDate) : undefined

  const [selectedTags, setSelectedTags] = React.useState<ItemOption[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<ItemOption>()

  useEffect(() => {
    if (defaultValue) {
      if (categoriesResponse.data?.length) {
        const _selectedCategory = categoriesResponse.data?.find((category) => category.value === defaultValue.category!.id.toString())
        setSelectedCategory(_selectedCategory)
      }

      if (tagsResponse.data?.length) {
        const _selectedTags = tagsResponse.data?.filter((tag) => defaultValue.tags.some((t) => t.id.toString() === tag.value)) ?? []
        setSelectedTags(_selectedTags)
      }
    }
  }, [defaultValue, categoriesResponse.data, tagsResponse.data])

  return (
    <FormProvider {...form}>
      <Grid container spacing={2} component="form" onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid size={12}>
          <TextField
            fullWidth
            autoFocus
            label="Name"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            placeholder="Wash the car, Shop for groceries, etc."
            error={Boolean(form.formState.errors.name)}
            helperText={form.formState.errors.name?.message}
            color={form.formState.errors.name ? 'error' : 'primary'}
            {...form.register('name')}
          />
        </Grid>

        <Grid size={12}>
          <Suspense fallback={<LinearProgress />}>
            <Editor value={form.watch('description') ?? ''} onChange={(value) => form.setValue('description', value)} />
          </Suspense>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Duration"
            type="text"
            placeholder="1d, 4h, 1m"
            disabled={isLoading}
            error={Boolean(form.formState.errors.duration)}
            helperText={form.formState.errors.duration?.message}
            color={form.formState.errors.duration ? 'error' : 'primary'}
            {...form.register('duration', { validate: (value) => schema.validateSync(value).duration })}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              onChange={(e) => (
                form.setValue(
                  'state',
                  e.target.value as TaskState,
                  { shouldDirty: true, shouldValidate: true }
                )
              )}
              value={form.watch('state')}
              label="State"
              disabled={isLoading}
            >
              <MenuItem value={TaskState.TODO}>Todo</MenuItem>
              <MenuItem value={TaskState.IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={TaskState.COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              onChange={(e) => (
                form.setValue(
                  'priority',
                  e.target.value as TaskPriority,
                  { shouldDirty: true, shouldValidate: true }
                )
              )}
              value={form.watch('priority')}
              label="Priority"
              disabled={isLoading}
            >
              <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="Expiry Date"
              disabled={isLoading}
              value={formattedExpiryDate ?? null}
              slotProps={{
                textField: {
                  error: Boolean(form.formState.errors.expiryDate),
                  helperText: form.formState.errors.expiryDate?.message,
                  color: form.formState.errors.expiryDate ? 'error' : 'primary',
                },
              }}
              sx={{ width: '100%' }}
              onChange={(e) => e && (
                form.setValue(
                  'expiryDate',
                  e.toDate(),
                  { shouldDirty: true, shouldValidate: true }
                )
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ListBox
            label="Category"
            value={selectedCategory || null}
            onChange={(value) => {
              setSelectedCategory(value)
              form.setValue(
                'categoryId',
                parseInt(value.value),
                { shouldDirty: true, shouldValidate: true }
              )
            }}
            isLoading={categoriesResponse.isLoading || isLoading}
            options={categoriesResponse.data || []}
            error={form.formState.errors.categoryId?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MultiListBox
            label="Tags"
            value={selectedTags}
            onChange={(value) => {
              setSelectedTags(value)
              form.setValue(
                'tagIds',
                value.map((tag) => parseInt(tag.value)),
                { shouldDirty: true, shouldValidate: true }
              )
            }}
            isLoading={tagsResponse.isLoading || isLoading}
            options={tagsResponse.data || []}
            error={form.formState.errors.tagIds?.message}
          />
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Save
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
