import { createModel } from "@rematch/core";
import { RootModel } from "../store";
import { SafeAreas } from "@/types";

type SafeAreasState = {
  safeAreas: SafeAreas | null; // Allow it to be null initially
};

const screen = createModel<RootModel>()({
  state: {
    safeAreas: null, // Initial state is null
  } as SafeAreasState,

  reducers: {
    setSafeAreas: (state: SafeAreasState, safeAreas: SafeAreas) => {
      return {
        safeAreas: {
          ...state.safeAreas,
          ...safeAreas,
        },
      };
    },
  },
});

export default screen;
