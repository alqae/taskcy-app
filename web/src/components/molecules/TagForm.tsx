import * as yup from 'yup'
import { forwardRef } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { MuiColorInput } from 'mui-color-input'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

import type { Tag } from '@types'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  color: yup.string().required('Color is required'),
})

export interface TagFormProps {
  defaultValue?: Tag
  onSubmit: (data: yup.InferType<typeof schema>) => void
}

export const TagForm = forwardRef<HTMLFormElement, TagFormProps>(({ defaultValue, onSubmit }, ref) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValue?.name || '',
      description: defaultValue?.description || '',
      color: defaultValue?.color || '',
    },
    mode: 'all'
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} ref={ref}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            autoComplete="off"
            placeholder="Finance, Health, etc."
            error={Boolean(form.formState.errors.name)}
            helperText={form.formState.errors.name?.message}
            color={form.formState.errors.name ? 'error' : 'primary'}
            {...form.register('name')}
          />

          <TextField
            label="Description"
            placeholder="Description"
            error={Boolean(form.formState.errors.description)}
            helperText={form.formState.errors.description?.message}
            color={form.formState.errors.description ? 'error' : 'primary'}
            {...form.register('description')}
          />

          <MuiColorInput
            label="Color"
            format="hex"
            placeholder="Color"
            error={Boolean(form.formState.errors.color)}
            helperText={form.formState.errors.color?.message}
            color={form.formState.errors.color ? 'error' : 'primary'}
            value={form.watch('color')}
            onChange={(value) => form.setValue('color', value, { shouldDirty: true, shouldValidate: true })}
          />
        </Stack>
      </form>
    </FormProvider>
  )
})
