import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface InitialState {
  value: any
}

// Define the initial state using that type
const initialState: InitialState = {
  value: null,
}

export const initialSlice = createSlice({
  name: 'initial',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setInitialValue: (state, action: PayloadAction<InitialState>) => {
      state.value = action.payload
    },
  },
})

export const { setInitialValue } = initialSlice.actions

export default initialSlice.reducer
