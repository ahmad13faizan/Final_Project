import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "../redux/onboardingSlice"; // Adjust path as needed
import costExplorerReducer from "./costExplorerSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer, // This is where we store the onboarding state
    costExplorer: costExplorerReducer
  },
});
