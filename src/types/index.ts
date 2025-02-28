export type composedUrl = {
  clientId: string;
  authUrl: string;
  composedUrl: string;
  nonce: number;
};

export type UserType = {
  userId: string;
  access_token: string;
  name: string;
  surname: string;
  email: string;
} | null;

export enum RequestType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type Document = {
  id: number;
  title: string;
  status: string;
  from: string;
  time: string;
  email: string;
  recipient: string;
  recipientMail: string;
};

export type SafeAreas = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  canvasRectWidth?: number;
  canvasRectHeight?: number;
} | null;

export type ContactType = {
  isActive: boolean;
} | null;

type ReceivedByMeType = {
  isSigned: boolean;
  signedAt: string | null;
  mediaId: string | null;
  document: {
    file_name: string;
    file_original_name: string;
    createdAt: string;
    uploadedBy: {
      name: string;
      surname: string;
      email: string;
    };
  };
};

type SentByMeType = {
  file_name: string;
  file_original_name: string;
  status: "PENDING" | "COMPLETED" | "DRAFT";
  createdAt: string;
  signers: {
    isSigned: boolean;
    signedAt: string | null;
    mediaId: string | null;
    email: string;
    name: string;
    surname: string;
  }[];
};

type SignerDocType = {
  id: string;
  signer_id: string;
  process_instance_id: string;
  file_name: string;
  task_id: string;
  status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "DRAFT" | "ABORTED";
}

export type DocType = ReceivedByMeType & SentByMeType & SignerDocType;

export type SendDocType = {
  signatureFile: File;
  callbackUrl: string;
  messageText: string;
  pageNumber: number;
  bottomLeftXCoordinate: number;
  bottomLeftYCoordinate: number;
  topRightXCoordinate: number;
  topRightYCoordinate: number;
  email: string;
  sender: string;
};
