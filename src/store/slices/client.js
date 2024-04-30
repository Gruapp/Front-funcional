import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    client: null,
    usersOnline: [],
    estoyBloqueado: false,
  },
  reducers: {
    login: (state, action) => {
      console.log(action.payload);
      state.client = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.usersOnline = action.payload;
    },
    setEstoyBloqueado: (state, action) => {
      state.estoyBloqueado = action.payload.some(
        (idCliente) => idCliente === state.client?.idCliente
      );
    },
  },
});

export default clientSlice.reducer;
export const { login, setOnlineUsers, setEstoyBloqueado } = clientSlice.actions;
