import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roleArn: "",
  accountId: "",
  accountName: "",
  region: ""
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setRoleArn: (state, action) => {
      state.roleArn = action.payload;
    },
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
    setAccountName: (state, action) => {
      state.accountName = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    clearAccountData: () => initialState // reset state to initial
  }
});

export const { setRegion, setRoleArn, setAccountId, setAccountName, clearAccountData } = onboardingSlice.actions;
export default onboardingSlice.reducer;
