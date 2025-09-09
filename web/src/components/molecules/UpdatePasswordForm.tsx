import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import * as yup from 'yup'
import React from 'react'

import { useUpdatePasswordMutation } from '@store/apis/profileApi'

const schema = yup.object().shape({
  currentPassword: yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  newPassword: yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
})

export const UpdatePasswordForm: React.FC = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation()

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    try {
      updatePassword(data)
    } finally {
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }, { keepTouched: false })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack spacing={2}>
          <Typography variant="h6">Update Password</Typography>
          <Typography variant="body2">
            This form allows users to update their password. It requires a new password and a confirmation of the password.
          </Typography>

          <TextField
            label="Current Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••"
            disabled={isLoading}
            error={Boolean(form.formState.errors.currentPassword)}
            helperText={form.formState.errors.currentPassword?.message}
            color={form.formState.errors.currentPassword ? 'error' : 'primary'}
            {...form.register('currentPassword')}
          />

          <TextField
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            disabled={isLoading}
            error={Boolean(form.formState.errors.newPassword)}
            helperText={form.formState.errors.newPassword?.message}
            color={form.formState.errors.newPassword ? 'error' : 'primary'}
            {...form.register('newPassword')}
          />

          <TextField
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            disabled={isLoading}
            error={Boolean(form.formState.errors.confirmPassword)}
            helperText={form.formState.errors.confirmPassword?.message}
            color={form.formState.errors.confirmPassword ? 'error' : 'primary'}
            {...form.register('confirmPassword')}
          />

          <div>
            <Button
              size="medium"
              type="submit"
              variant="contained"
              disabled={!form.formState.isValid || isLoading}
            >
              Save
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
