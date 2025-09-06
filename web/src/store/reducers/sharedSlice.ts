import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SharedState {
  isLoading: boolean
}

const initialState: SharedState = { isLoading: false }

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setIsLoading } = sharedSlice.actions
export default sharedSlice.reducer
