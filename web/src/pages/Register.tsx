import { FormProvider, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import * as yup from 'yup'
import React from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

import ErrorBoundary from '@/wrappers/ErrorBoundary'
import { useAuth } from '@/context/AuthContext'

const schema = yup.object().shape({
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
})

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth()

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'all',
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    register(data)
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Register | Taskcy</title>
        <meta name="description" content="This is the register page of Taskcy." />
      </Helmet>

      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign up
      </Typography>

      <FormProvider {...form}>
        <Box
          component="form"
          onSubmit={form.handleSubmit(handleSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="firstName">First name</FormLabel>
            <TextField
              autoComplete="firstName"
              fullWidth
              id="firstName"
              placeholder="Jon"
              error={Boolean(form.formState.errors.firstName)}
              helperText={form.formState.errors.firstName?.message}
              color={form.formState.errors.firstName ? 'error' : 'primary'}
              {...form.register('firstName')}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="lastName">Last name</FormLabel>
            <TextField
              autoComplete="lastName"
              fullWidth
              id="lastName"
              placeholder="Snow"
              error={Boolean(form.formState.errors.lastName)}
              helperText={form.formState.errors.lastName?.message}
              color={form.formState.errors.lastName ? 'error' : 'primary'}
              {...form.register('lastName')}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              fullWidth
              id="email"
              placeholder="your@email.com"
              autoComplete="email"
              variant="outlined"
              error={Boolean(form.formState.errors.email)}
              helperText={form.formState.errors.email?.message}
              color={form.formState.errors.email ? 'error' : 'primary'}
              {...form.register('email')}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              fullWidth
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={Boolean(form.formState.errors.password)}
              helperText={form.formState.errors.password?.message}
              color={form.formState.errors.password ? 'error' : 'primary'}
              {...form.register('password')}
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I want to receive updates via email."
          />

          <Button type="submit" fullWidth variant="contained" loading={isLoading}>
            Sign up
          </Button>
        </Box>
      </FormProvider>

      <Divider>
        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
      </Divider>

      <Typography sx={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{ alignSelf: 'center' }}
        >
          Sign in
        </Link>
      </Typography>
    </ErrorBoundary>
  )
}
