import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";
import FieldsRecipientReviewStep from "@/components/FieldsRecipientReviewStep";
import Button from "@/components/Button";
import MeandOther from "@/assets/meandOther.svg";
import CheckIcon from "@/assets/checkIcon.svg";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { useDisclosure } from "@/core/hooks/useDisclosure";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
import { CALLBACK_URL } from "@/constants";
import IcAlert from "@/assets/components/IcAlert";

const Recipient = ({ f7router }: { f7router: Router.Router }) => {
  const { isOpen, close, open } = useDisclosure();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const docState = useAppSelector((state) => state.doc);
  const loading = useAppSelector((state) => state.loading.models.contact);
  const isContactActive = useAppSelector((state) => state.contact.isActive);
  const user = useAppSelector((state) => state.auth.user);
  const [inputsValue, setInputsValue] = useState({
    name: docState?.name || "",
    email: docState?.email || "",
  });
  const dispatch = useAppDispatch();

  const checkContact = async () => {
    try {
      await dispatch.contact.checkContactActivity(inputsValue.email);
    } catch (e) {
      console.log(e);
    }
  };

  const inviteContact = async () => {
    try {
      const response = await dispatch.contact.inviteContact({
        recipient: inputsValue.email,
        sender: user!.email,
      });
      if (response === "Success") {
        f7router.back("/", { force: true });
        dispatch.contact.setContactActivity(null);
        dispatch.doc.setDoc(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isContactActive === false) open();
    else if (isContactActive) {
      dispatch.doc.setDoc({
        sender: user?.email,
        callbackUrl: CALLBACK_URL,
      });
      f7router.navigate("/review");
    }
  }, [isContactActive]);

  return (
    <MyPage name="Recipient">
      <Header
        title="Request Signature"
        back={() => {
          f7router.back("/", { force: true });
          dispatch.doc.setDoc(null);
          dispatch.contact.setContactActivity(null);
        }}
      />
      <FieldsRecipientReviewStep step="recipient" />
      <section
        title="content"
        className={clsx(
          "bg-white rounded-t-[20px] pt-6 flex flex-col",
          isInputFocused && "overflow-scroll"
        )}
        style={{
          height: `calc(100vh - 148px - ${safeAreas?.top ?? 0}px)`,
        }}
      >
        <h2 className="text-primaryTextColor text-xl font-bold px-4">Add Recipients</h2>
        <div
          className={clsx(
            "py-6 px-4 flex-1 flex flex-col gap-6",
            !isInputFocused && "overflow-scroll"
          )}
        >
          <div>
            <p className="text-sm font-medium text-primaryTextColor">Select who needs to sign</p>
            <div className="flex gap-3 items-center mt-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#E4EBFD]">
                <img className="text-[24px] leading-5 font-bold text-blue" src={MeandOther} />
              </div>
              <div className="flex flex-col gap-1 flex-grow">
                <p className="text-mainDarkBlue text-sm font-medium">Me and other</p>
                <p className="text-gray text-xs leading-normal">
                  Only me and one other recipients selected.
                </p>
              </div>
              <img className="text-[24px] leading-5 font-bold text-blue w-6" src={CheckIcon} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-primaryTextColor">Recipient</p>
            <Input
              label="Name"
              type="text"
              placeholder="Enter recipient name"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              value={inputsValue.name}
              onChange={(e) => {
                setInputsValue({ ...inputsValue, name: e.target.value });
                dispatch.doc.setDoc({ name: e.target.value });
              }}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="Enter recipient email address"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              value={inputsValue.email}
              onChange={(e) => {
                setInputsValue({ ...inputsValue, email: e.target.value });
                dispatch.doc.setDoc({ email: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="w-full pt-[6px] pb-[42px] px-4 flex gap-4 border-t-2 bg-main border-buttonContainer">
          <Button
            text="Previous"
            disabled={loading}
            type="previous"
            onClick={() => f7router.back()}
          />
          <Button
            text="Continue"
            disabled={loading || !!Object.values(inputsValue).filter((val) => val === "").length}
            isLoading={loading}
            onClick={checkContact}
          />
        </div>
      </section>
      {isOpen && (
        <Modal
          onClose={close}
          title="It looks like this contact hasn’t opened the Miniapp yet."
          subtitle="We’ll send them a link to get started"
        >
          <div className="flex gap-3 w-full">
            <div className="w-[44px] h-[44px] rounded-xl bg-textGrey flex justify-center items-center">
              <span className="text-2xl leading-6 font-bold text-backButton">
                {(docState?.name ?? "").charAt(0).toLocaleUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-mainDarkBlue text-sm font-medium">{docState!.name}</h4>
              <div className="flex items-center gap-1">
                <p className="mt-1 text-gray text-xs">{docState?.email}</p>
                {!isContactActive && <IcAlert />}
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <Button
              text="Cancel"
              disabled={loading}
              onClick={() => {
                dispatch.contact.setContactActivity(null);
                close();
              }}
              type="previous"
            />
            <Button text="Send" disabled={loading} isLoading={loading} onClick={inviteContact} />
          </div>
        </Modal>
      )}
    </MyPage>
  );
};

export default Recipient;
