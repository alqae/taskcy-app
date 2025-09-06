import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import * as yup from 'yup'
import React from 'react'

import { getUserLogged } from '@store/reducers/authSlice'
import { useAppSelector } from '@store/store'

const schema = yup.object().shape({
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
})

export const UpdateBasicInformation: React.FC = () => {
  const userLogged = useAppSelector(getUserLogged)

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: userLogged?.firstName || '',
      lastName: userLogged?.lastName || '',
      email: userLogged?.email || '',
    },
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    console.log(data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h6">Basic Information</Typography>
          <Typography variant="body2">
            This form allows users to edit and save essential account information, such as their first name, last name,
            email address, and other personal profile fields. Its purpose is to keep contact and profile information up-to-date.
          </Typography>

          <TextField
            label="First Name"
            type="text"
            autoComplete="given-name"
            autoFocus
            placeholder="John"
            error={Boolean(form.formState.errors.firstName)}
            helperText={form.formState.errors.firstName?.message}
            color={form.formState.errors.firstName ? 'error' : 'primary'}
            {...form.register('firstName')}
          />

          <TextField
            label="Last Name"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            error={Boolean(form.formState.errors.lastName)}
            helperText={form.formState.errors.lastName?.message}
            color={form.formState.errors.lastName ? 'error' : 'primary'}
            {...form.register('lastName')}
          />

          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            error={Boolean(form.formState.errors.email)}
            helperText={form.formState.errors.email?.message}
            color={form.formState.errors.email ? 'error' : 'primary'}
            {...form.register('email')}
          />

          <div>
            <Button
              size="medium"
              type="submit"
              variant="contained"
              disabled={!form.formState.isValid || !form.formState.isDirty}
            >
              Save
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
