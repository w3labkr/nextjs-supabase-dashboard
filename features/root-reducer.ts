import { combineReducers } from '@reduxjs/toolkit'

import initialReducer from './initial-slice'

// Nested Persists
const rootReducer = combineReducers({ initial: initialReducer })

export default rootReducer
