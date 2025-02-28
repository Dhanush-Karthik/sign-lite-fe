import { createModel } from "@rematch/core";
import { RootModel } from "../store";
import { miniappClient } from "@/core/miniappClient";
import { API_BASE_URL, API_PATHS } from "@/constants";
import axios from "axios";

type SendDocState = {
  signatureFile?: File;
  callbackUrl?: string;
  messageText?: string;
  pageNumber?: number;
  bottomLeftXCoordinate?: number;
  bottomLeftYCoordinate?: number;
  topRightXCoordinate?: number;
  topRightYCoordinate?: number;
  nomineePageNumber?: number;
  nomineeBottomLeftXCoordinate?: number;
  nomineeBottomLeftYCoordinate?: number;
  nomineeTopRightXCoordinate?: number;
  nomineeTopRightYCoordinate?: number;
  email?: string;
  sender?: string;
  name?: string;
  emailSubject?: string;
} | null;

const initialState = {
  signatureFile: undefined,
  callbackUrl: undefined,
  messageText: undefined,
  pageNumber: undefined,
  bottomLeftXCoordinate: undefined,
  bottomLeftYCoordinate: undefined,
  topRightXCoordinate: undefined,
  topRightYCoordinate: undefined,
  nomineePageNumber: undefined,
  nomineeBottomLeftXCoordinate: undefined,
  nomineeBottomLeftYCoordinate: undefined,
  nomineeTopRightXCoordinate: undefined,
  nomineeTopRightYCoordinate: undefined,
  email: undefined,
  sender: undefined,
  name: undefined,
  emailSubject: undefined,
};

const docs = createModel<RootModel>()({
  state: initialState as SendDocState,

  reducers: {
    setDoc: (state: SendDocState, doc: SendDocState) => {
      if (doc === null) return initialState;
      return {
        ...state,
        ...doc,
      };
    },
  },
  effects: () => ({
    async getDoc({ email, process_instance_id }: { email: string, process_instance_id: string }) {
      const url = `${API_BASE_URL}${API_PATHS.GET_DOCUMENT}`.replace("email", email).replace("flowInstanceId", process_instance_id);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        url,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      return response.data;
    },

    async getAllDocs({ email }: { email: string }) {
      const url = `${API_PATHS.GET_REQUESTED_DOCS}`.replace("email", email);
      const response = await miniappClient.get(url);
      return response.data;
    },

    async getAllSignerDocs({ email }: { email: string }) {
      const url = `${API_PATHS.GET_ALL_SIGNER_DOCS}`.replace("email", email);
      const response = await miniappClient.get(url);
      return response.data;
    },

    async getUserDetails({ email }: { email: string }) {
      const url = `${API_PATHS.USER_INFO}`.replace("email", email);
      const response = await miniappClient.get(url);
      return response.data;
    },

    async revokeNectValidation({ email }: { email: string }) {
      const url = `${API_PATHS.REVOKE_NECT_VALIDATION}`.replace("email", email);
      const response = await miniappClient.delete(url);
      console.log(response);
      return response.status;
    },

    async getOneDoc({ mediaId, fileName }: { mediaId?: string; fileName?: string }) {
      const response: Blob = await miniappClient.get(
        mediaId
          ? `${API_PATHS.GET_ONE_DOC_MEDIA}/?mediaId=${mediaId}`
          : `${API_PATHS.GET_ONE_DOC_FILE_NAME}/${fileName}.pdf`,
        { responseType: "blob" }
      );
      const blobUrl = URL.createObjectURL(response);
      return blobUrl;
    },

    async sendDoc(payload: FormData) {
      const response: "Success" = await miniappClient.post(API_PATHS.SEND_DOC, payload);

      return response;
    },
  }),
});

export default docs;
