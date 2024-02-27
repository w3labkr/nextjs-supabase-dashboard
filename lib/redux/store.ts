import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import rootReducer from '@/store/root-reducer'

// Error: redux-persist failed to create sync storage. falling back to noop storage.
// import storage from 'redux-persist/lib/storage'
import storage from '@/lib/redux/storage'

/**
 * Redux Toolkit Setup with Next.js
 *
 * @link https://redux.js.org/usage/nextjs
 * @link https://github.com/rt2zz/redux-persist
 */
const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  // Error: A non-serializable value was detected in an action, in the path: `register`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export const makeStore = () => store

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
