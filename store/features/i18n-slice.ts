import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { defaultLng } from '@/i18next.config'

// Define a type for the slice state
interface I18nState {
  resolvedLanguage: string
}

// Define the initial state using that type
const initialState: I18nState = {
  resolvedLanguage: defaultLng,
}

export const i18nSlice = createSlice({
  name: 'i18n',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setResolvedLanguage: (
      state,
      action: PayloadAction<I18nState['resolvedLanguage']>
    ) => {
      state.resolvedLanguage = action.payload
      document.cookie = `i18n:resolvedLanguage=${action.payload}`
    },
  },
})

export const { setResolvedLanguage } = i18nSlice.actions

export default i18nSlice.reducer
