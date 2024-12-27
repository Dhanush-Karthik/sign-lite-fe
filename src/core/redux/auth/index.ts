import { createModel } from "@rematch/core";
import { RootModel } from "../store";
import { UserType } from "@/types";

type AuthState = {
  user: UserType;
};

const auth = createModel<RootModel>()({
  state: {
    user: null,
  } as AuthState,

  reducers: {
    setUser: (state: AuthState, user: UserType) => {
      return {
        ...state,
        user,
      };
    },
  },
});

export default auth;
