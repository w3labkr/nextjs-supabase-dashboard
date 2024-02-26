import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Session, User } from '@supabase/supabase-js'

// Define a type for the slice state
export interface InitialState {
  session: Session | null
  user: User | null
}

// Define the initial state using that type
const initialState: InitialState = {
  session: null,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<InitialState>) => {
      state.session = action.payload
    },
    setUser: (state, action: PayloadAction<InitialState>) => {
      state.user = action.payload
    },
    signOut: (state) => {
      state.session = initialState.session
      state.user = initialState.user
    },
  },
})

export const { setSession, setUser, signOut } = authSlice.actions

export default authSlice.reducer
