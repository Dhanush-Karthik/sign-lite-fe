import { createModel } from "@rematch/core";
import { RootModel } from "../store";

type Signer = {
  name: string;
  email: string;
  pageNumber?: number;
  bottomLeftXCoordinate?: number;
  bottomLeftYCoordinate?: number;
  topRightXCoordinate?: number;
  topRightYCoordinate?: number;
};

type SendDocState = {
  signatureFile?: File;
  callbackUrl?: string;
  messageText?: string;
  emailSubject?: string;
  sender?: string;
  signers: Signer[]; // List of signers
} | null;

const initialState: SendDocState = {
  signatureFile: undefined,
  callbackUrl: undefined,
  messageText: undefined,
  emailSubject: undefined,
  sender: undefined,
  signers: [
    {
      name: "",
      email: "",
      pageNumber: undefined,
      bottomLeftXCoordinate: undefined,
      bottomLeftYCoordinate: undefined,
      topRightXCoordinate: undefined,
      topRightYCoordinate: undefined,
    },
  ], // Initial state with one empty signer
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
  effects: () => ({}),
});

export default docs;
