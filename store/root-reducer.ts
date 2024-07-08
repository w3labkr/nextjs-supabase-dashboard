import { combineReducers } from '@reduxjs/toolkit'
import appReducer from '@/store/reducers/app-reducer'

// Nested Persists
const rootReducer = combineReducers({
  app: appReducer,
})

export default rootReducer
