import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IVerify {
  isVerified: boolean;
}

const initialState: IVerify = {
  isVerified: false,
};

const verifySlice = createSlice({
  name: "isVerified",
  initialState,
  reducers: {
    setVerify: (state, action: PayloadAction<IVerify>) => {
      state.isVerified = action.payload.isVerified;
    },
  },
});

export const { setVerify } = verifySlice.actions;
export default verifySlice.reducer;
