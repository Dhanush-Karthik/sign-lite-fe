const API_BASE_URL = "https://shiftpen-miniapp.dev.grootan.net";
const API_PATHS = {
  GET_COMPOSED_URL: "/v1/auth/getComposedUrl",
  LOGIN: "/v1/auth/login-oidc",
  CHECK_CONTACT_ACTIVITY: "/v1/user/check-user",
  INVITE_CONTACT: "/v1/chat/invite",
  SEND_DOC: "/v1/document/upload",
  GET_ONE_DOC_MEDIA: "/v1/chat/media",
  GET_ONE_DOC_FILE_NAME: "/v1/document",
  GET_ALL_DOCS: "/v1/document/list",
  GET_REQUESTED_DOCS: "api/email/requester-documents",
  GET_ALL_SIGNER_DOCS: "/api/email/assigned-documents",
  GET_DOCUMENT: "/api/email/document/flowInstanceId",
  PUSH_DOC_TO_CHAT: "api/email/push-document",
};

const CALLBACK_URL = window.location.protocol + "//" + window.location.host;

const IDP_BASE_URLS = (env: string | null) => {
  if (!env) return;
  return {
    ENV_ARABOX_PROD: "https://idp.cloud.kobil.com/",
    ENV_GONDOR_DEV: "https://idp.gondor-shift-dev-don8u.gondor.dev.kobil.com/",
    ENV_GONDOR_QA: "https://idp.gondor-shift-qa-fpl6t.gondor.dev.kobil.com/",
    ENV_IDP_LIGHT: "https://idp.gondor-westerops-7xrq0.gondor.dev.kobil.com/",
    ENV_MYCITYAPP: "https://idp.mycityapp.cloud.test.kobil.com/",
  }[env];
};

const TENANT_NAME = "avaloqapp";

const CHAT_SERVICE_ID = "0b669933-4742-4c21-8027-78f62d001f8a";

const CHAT_SERVİCE_SHARE_URL = `https://share.mycityapp.cloud.test.kobil.com/kobilservice?sID=${CHAT_SERVICE_ID}`;

const SECURE_CHAT_SHARE_URL = `https://share.gondor-shift-qa-fpl6t.gondor.dev.kobil.com/kobilservice?sID=f93e5f7b-26c3-4b52-8334-c031573f6457`;

export {
  API_PATHS,
  API_BASE_URL,
  IDP_BASE_URLS,
  TENANT_NAME,
  CALLBACK_URL,
  CHAT_SERVICE_ID,
  CHAT_SERVİCE_SHARE_URL,
  SECURE_CHAT_SHARE_URL
};
