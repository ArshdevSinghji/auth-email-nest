import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  username: string;
  email: string;
  imageUrl: string;
}

const initialState: IUser = {
  username: "",
  email: "",
  imageUrl: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.imageUrl = action.payload.imageUrl;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
