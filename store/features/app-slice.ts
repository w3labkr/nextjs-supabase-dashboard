import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
  value: any
}

// Define the initial state using that type
const initialState: AppState = {
  value: null,
}

export const appSlice = createSlice({
  name: 'initial',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAppValue: (state, action: PayloadAction<AppState>) => {
      state.value = action.payload
    },
  },
})

export const { setAppValue } = appSlice.actions

export default appSlice.reducer
