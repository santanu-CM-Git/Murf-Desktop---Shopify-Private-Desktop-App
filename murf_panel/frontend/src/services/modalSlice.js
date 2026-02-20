import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  component: null,
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state) => {
      state.open = true
    },
    close: (state) => {
      state.open = false,
      state.component = null
    },
    toggle: (state, action) => {
      state.open  = !state.open,
      state.component = null
    },
    setComponent: (state, action) => {
      state.component  = {
        name: action.payload.name,
        data: action.payload.data
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { open, close, toggle, component,setComponent } = modalSlice.actions

export default modalSlice.reducer