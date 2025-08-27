import { VariableSizeList, type ListChildComponentProps } from 'react-window'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import ListSubheader from '@mui/material/ListSubheader'
import { useTheme, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Popper from '@mui/material/Popper'
import * as React from 'react'

import type { ItemOption } from '@types'

const LISTBOX_PADDING = 8 // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props
  const dataSet = data[index]
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  }

  if (Object.prototype.hasOwnProperty.call(dataSet, 'group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    )
  }

  const { key, ...optionProps } = dataSet[0]

  return (
    <Typography key={key} component="li" {...optionProps} noWrap style={inlineStyle}>
      {dataSet[1]}
    </Typography>
  )
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

const useResetCache = <T,>(data: T) => {
  const ref = React.useRef<VariableSizeList>(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props
  const itemData: React.ReactElement<unknown>[] = [];
  (children as React.ReactElement<unknown>[]).forEach(
    (
      item: React.ReactElement<unknown> & {
        children?: React.ReactElement<unknown>[]
      },
    ) => {
      itemData.push(item)
      itemData.push(...(item.children || []))
    },
  )

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: React.ReactElement<unknown>) => {
    if (Object.prototype.hasOwnProperty.call(child, 'group')) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
})

interface ListBoxProps {
  options: ItemOption[]
  value?: ItemOption
  onChange: (value: ItemOption) => void
  label: string
  isLoading?: boolean
  error?: string
}

export const ListBox: React.FC<ListBoxProps> = ({ options, value, onChange, label, isLoading, error }) => (
  <Autocomplete
    fullWidth
    disableListWrap
    disabled={isLoading}
    loading={isLoading}
    loadingText="Loading..."
    isOptionEqualToValue={(option, value) => option.value === value.value}
    options={isLoading ? [] : options}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        error={Boolean(error)}
        helperText={error}
        slotProps={{
          input: {
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        }}
      />
    )}
    renderOption={(props, option, state) =>
      [props, option.label, state.index] as React.ReactNode
    }
    slots={{
      popper: StyledPopper,
    }}
    value={value}
    onChange={(_, value) => value && onChange?.(value as ItemOption)}
    slotProps={{
      listbox: {
        component: ListboxComponent,
      },
    }}
  />
)

interface MultiListBoxProps {
  options: ItemOption[]
  value: ItemOption[]
  onChange: (value: ItemOption[]) => void
  label: string
  isLoading?: boolean
  error?: string
}

export const MultiListBox: React.FC<MultiListBoxProps> = ({ options, value, onChange, label, isLoading, error }) => (
  <Autocomplete
    fullWidth
    multiple
    disableListWrap
    disableCloseOnSelect
    disabled={isLoading}
    loading={isLoading}
    loadingText="Loading..."
    options={isLoading ? [] : options}
    isOptionEqualToValue={(option, value) => option.value === value.value}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        helperText={error}
        error={Boolean(error)}
        color={error ? 'error' : 'primary'}
        slotProps={{
          input: {
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        }}
      />
    )}
    renderOption={(props, option, state) =>
      [props, option.label, state.index] as React.ReactNode
    }
    slots={{
      popper: StyledPopper,
    }}
    value={value}
    getOptionDisabled={(option) => value.findIndex((v) => v.value === option.value) !== -1}
    onChange={(_, value) => value && onChange(value as ItemOption[])}
    slotProps={{
      listbox: {
        component: ListboxComponent,
      },
    }}
  />
)

// TODO implemente error handling
