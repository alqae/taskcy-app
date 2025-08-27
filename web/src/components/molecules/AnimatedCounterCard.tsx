import Typography, { type TypographyProps } from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import Paper from '@mui/material/Paper'
import { alpha } from '@mui/material'

type Easing =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeOutCubic'
  | 'easeInOutCubic'

export interface AnimatedCounterProps extends Omit<TypographyProps, 'children' | 'prefix' | 'suffix'> {
  value: number
  duration?: number
  startFrom?: number
  format?: (n: number) => string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  easing?: Easing
  decimals?: number
  restartOnChange?: boolean
  onFrame?: (current: number) => void
}

const easings: Record<Easing, (t: number) => number> = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

const defaultFormat = (n: number, decimals?: number) => {
  if (decimals !== undefined) {
    return n.toFixed(decimals)
  }
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2)
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 900,
  startFrom = 0,
  format,
  prefix,
  suffix,
  easing = 'easeOutCubic',
  decimals,
  restartOnChange = false,
  onFrame,
  variant = 'body1',
  ...typographyProps
}) => {
  const [display, setDisplay] = useState<number>(startFrom)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const fromRef = useRef<number>(startFrom)
  const toRef = useRef<number>(value)
  const lastValueRef = useRef<number>(value)

  useEffect(() => {
    toRef.current = value
    if (!restartOnChange) {
      fromRef.current = display
    } else if (startFrom) {
      fromRef.current = startFrom
    }
    lastValueRef.current = value
    startTimeRef.current = null

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const animate = (ts: number) => {
      if (startTimeRef.current === null) startTimeRef.current = ts
      const elapsed = ts - startTimeRef.current
      const tRaw = Math.min(1, elapsed / Math.max(1, duration))
      const t = easings[easing](tRaw)
      const current = fromRef.current + (toRef.current - fromRef.current) * t
      setDisplay(current)
      onFrame?.(current)
      if (tRaw < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        rafRef.current = null
        setDisplay(toRef.current)
        onFrame?.(toRef.current)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, easing, restartOnChange])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const formatted = format
    ? format(display)
    : defaultFormat(display, decimals)

  return (
    <Typography
      component="span"
      variant={variant}
      aria-live="polite"
      sx={{ fontWeight: 'bold', fontSize: '4rem' }}
      {...typographyProps}
    >
      {prefix}
      {formatted}
      {suffix}
    </Typography>
  )
}

interface AnimatedCounterCardProps extends AnimatedCounterProps {
  legend: string
  caption?: string
  color: string
}

export const AnimatedCounterCard: React.FC<AnimatedCounterCardProps> = ({
  legend,
  caption,
  color,
  ...props
}) => {
  return (
    <Paper sx={{ p: 2, bgcolor: alpha(color, 0.1), borderRadius: 2, border: '1px solid', borderColor: color }}>
      <Typography variant="h6" gutterBottom sx={{ color }}>
        {legend}
      </Typography>
      <AnimatedCounter {...props} sx={{ color }} />
      <Typography variant="body2" color="text.secondary" sx={{ color }}>
        {caption}
      </Typography>
    </Paper>
  )
}
