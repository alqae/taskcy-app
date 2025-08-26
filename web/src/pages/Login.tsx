import { Link as RouterLink } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
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
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  remember: yup.boolean(),
})

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'all',
  })

  const handleSubmit = (data: yup.InferType<typeof schema>) => {
    login(data)
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Login | Taskcy</title>
        <meta name="description" content="This is the login page of Taskcy." />
      </Helmet>

        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign In
        </Typography>

      <FormProvider {...form}>
      <Box
          component="form"
          onSubmit={form.handleSubmit(handleSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              fullWidth
              id="email"
              placeholder="your@email.com"
              autoComplete="email"
              variant="outlined"
              disabled={isLoading}
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
              autoComplete="password"
              variant="outlined"
              disabled={isLoading}
              error={Boolean(form.formState.errors.password)}
              helperText={form.formState.errors.password?.message}
              color={form.formState.errors.password ? 'error' : 'primary'}
              {...form.register('password')}
            />
          </FormControl>

          <FormControlLabel
            control={(
              <Checkbox
                checked={form.watch('remember')}
                onChange={(e) => form.setValue('remember', e.target.checked)}
                color="primary"
              />
            )}
            label="Remember me"
          />

          <Button type="submit" fullWidth variant="contained" loading={isLoading}>
            Sign in
          </Button>
        </Box>
      </FormProvider>

        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>or</Typography>
        </Divider>

        <Typography sx={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Sign up
          </Link>
        </Typography>
    </ErrorBoundary>
  )
}
