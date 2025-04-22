import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    roleArn: "",
    accountId: "",
    accountName: ""
  },
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
    }

  }
});

export const {setRegion, setRoleArn, setAccountId, setAccountName } = onboardingSlice.actions;
export default onboardingSlice.reducer;
