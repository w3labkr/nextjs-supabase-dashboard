import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface appState {
  panelSizes: number[]
  panelCollapsed: boolean
}

// Define the initial state using that type
const initialState: appState = {
  panelSizes: [25, 75],
  panelCollapsed: false,
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPanelSizes: (state, action: PayloadAction<appState['panelSizes']>) => {
      state.panelSizes = action.payload
    },
    setPanelCollapsed: (
      state,
      action: PayloadAction<appState['panelCollapsed']>
    ) => {
      state.panelCollapsed = action.payload
    },
  },
})

export const { setPanelSizes, setPanelCollapsed } = appSlice.actions

export default appSlice.reducer
