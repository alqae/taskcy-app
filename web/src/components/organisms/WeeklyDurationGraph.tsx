import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

const otherSetting = {
  height: 300,
  yAxis: [{ label: 'Hours', width: 60, max: 24 }],
  grid: { horizontal: true },
}

// Dummy data for a week (Monday to Sunday)
const dataset = [
  { day: 'Monday', hoursSpent: 5 },
  { day: 'Tuesday', hoursSpent: 6 },
  { day: 'Wednesday', hoursSpent: 7.5 },
  { day: 'Thursday', hoursSpent: 4 },
  { day: 'Friday', hoursSpent: 6.5 },
  { day: 'Saturday', hoursSpent: 2 },
  { day: 'Sunday', hoursSpent: 3 },
]

const valueFormatter = (value: number | null) => `${value} hrs`

export const WeeklyDurationGraph: React.FC = () => (
  <BarChart
    dataset={dataset}
    xAxis={[
      {
        scaleType: 'band',
        dataKey: 'day',
        valueFormatter: (day: string) => day,
        height: 40,
      },
    ]}
    series={[
      {
        dataKey: 'hoursSpent',
        label: 'Hours Spent',
        valueFormatter,
      },
    ]}
    {...otherSetting}
  />
)
