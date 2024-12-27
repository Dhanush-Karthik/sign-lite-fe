import { createModel } from "@rematch/core";
import { RootModel } from "../store";
import { miniappClient } from "@/core/miniappClient";
import { API_PATHS } from "@/constants";

type ContactState = {
  isActive: boolean | null;
};

const contact = createModel<RootModel>()({
  state: {
    isActive: null,
  } as ContactState,

  reducers: {
    setContactActivity: (state: ContactState, isActive: boolean | null) => {
      return {
        ...state,
        isActive,
      };
    },
  },

  effects: (dispatch) => ({
    async checkContactActivity(email: string) {
      const response: boolean = await miniappClient.get(
        `${API_PATHS.CHECK_CONTACT_ACTIVITY}/?email=${email}`
      );
      dispatch.contact.setContactActivity(response);
    },
    async inviteContact(payload: { recipient: string; sender: string }) {
      const response: string = await miniappClient.post(API_PATHS.INVITE_CONTACT, payload);
      return response;
    },
  }),
});

export default contact;
