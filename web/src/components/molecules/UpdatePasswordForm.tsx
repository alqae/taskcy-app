import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import * as yup from 'yup'
import React from 'react'

const schema = yup.object().shape({
  password: yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
})

export const UpdatePasswordForm: React.FC = () => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    console.log(data)
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
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
            error={Boolean(form.formState.errors.password)}
            helperText={form.formState.errors.password?.message}
            color={form.formState.errors.password ? 'error' : 'primary'}
            {...form.register('password')}
          />

          <TextField
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••"
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
              disabled={!form.formState.isValid}
            >
              Save
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
