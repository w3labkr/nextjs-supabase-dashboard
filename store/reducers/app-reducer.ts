import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { defaultLng } from '@/i18next.config'

// Define a type for the slice state
interface State {
  theme: string
  language: string
  layout: number[]
  collapsed: boolean
}

// Define the initial state using that type
const initialState: State = {
  theme: 'system',
  language: defaultLng,
  layout: [25, 75],
  collapsed: false,
}

export const slice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAppTheme: (state, action: PayloadAction<State['theme']>) => {
      state.theme = action.payload
      document.cookie = `app:theme=${action.payload};path=/`
    },
    setAppLanguage: (state, action: PayloadAction<State['language']>) => {
      state.language = action.payload
      document.documentElement.lang = action.payload
      document.cookie = `app:language=${action.payload};path=/`
    },
    setAppLayout: (state, action: PayloadAction<State['layout']>) => {
      state.layout = action.payload
    },
    setAppCollapsed: (state, action: PayloadAction<State['collapsed']>) => {
      state.collapsed = action.payload
    },
  },
})

export const { setAppTheme, setAppLanguage, setAppLayout, setAppCollapsed } =
  slice.actions

export default slice.reducer
