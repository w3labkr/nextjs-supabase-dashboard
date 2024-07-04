import { combineReducers } from '@reduxjs/toolkit'

// import appReducer from './features/app-slice'
import appReducer from './features/app-slice'
import i18nReducer from './features/i18n-slice'

// Nested Persists
const rootReducer = combineReducers({
  app: appReducer,
  i18n: i18nReducer,
})

export default rootReducer
