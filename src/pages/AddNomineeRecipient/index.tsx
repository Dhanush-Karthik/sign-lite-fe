import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import MeandOther from "@/assets/meandOther.svg";
import CheckIcon from "@/assets/checkIcon.svg";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
import axios from "axios";
import { f7 } from "framework7-react";
import AddNomineeFieldsRecipientReviewStep from "@/components/AddNomineeFieldsRecipientReviewStep";
import { API_BASE_URL } from "@/constants";
import SignerInput from "@/components/signerInput";

const AddNomineeRecipient = ({ f7router }: { f7router: Router.Router }) => {
  // const { isOpen, close, open } = useDisclosure();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const loading = useAppSelector((state) => state.loading.models.contact);
  const dispatch = useAppDispatch();
  const [isValid, setIsValid] = useState(false);

  interface Signer {
    name: string;
    email: string;
    pageNumber?: number;
    bottomLeftXCoordinate?: number;
    bottomLeftYCoordinate?: number;
    topRightXCoordinate?: number;
    topRightYCoordinate?: number;
  }

  const [signers, setSigners] = useState<Signer[]>([
    {
      name: "",
      email: "",
      pageNumber: undefined,
      bottomLeftXCoordinate: undefined,
      bottomLeftYCoordinate: undefined,
      topRightXCoordinate: undefined,
      topRightYCoordinate: undefined,
    },
  ]);

  const handleAddSigner = () => {
    setSigners([...signers, {
      name: "",
      email: "",
      pageNumber: undefined,
      bottomLeftXCoordinate: undefined,
      bottomLeftYCoordinate: undefined,
      topRightXCoordinate: undefined,
      topRightYCoordinate: undefined,
    }])
  };

  const handleRemoveSigner = (index: number) => {
    const updatedSigners = signers.filter((_, i) => i !== index);
    setSigners(updatedSigners);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    console.log(signers);
    const updatedSigners = signers.map((signer, i) =>
      i === index ? { ...signer, [field]: value } : signer
    );
    setSigners(updatedSigners);
  };

  const handleSubmit = () => {
    console.log("Signers data:", signers);
    dispatch.multidoc.setDoc({signers: signers});
    f7.views.main.router.navigate("/addNomineeRequestSignature");
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const isFormValid = signers.length>0 && signers.every(
      (signer) =>
        signer.name.trim() !== "" &&
        signer.email.trim() !== "" 
        // && isValidEmail(signer.email)
    );
    setIsValid(isFormValid);
  }, [signers]);

  return (
    <MyPage name="Recipient">
      <Header
        title="Request Signature"
        back={() => {
          f7router.back("/", { force: true });
          dispatch.multidoc.setDoc(null);
          dispatch.contact.setContactActivity(null);
        }}
      />
      <AddNomineeFieldsRecipientReviewStep step="recipient" />
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
            <div className="flex gap-3 items-center mt-4 display-none">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#E4EBFD]">
                <img className="text-[24px] leading-5 font-bold text-blue" src={MeandOther} />
              </div>
              <div className="flex flex-col gap-1 flex-grow ">
                <p className="text-mainDarkBlue text-sm font-medium">Me and other</p>
                <p className="text-gray text-xs leading-normal">
                  Only me and one other recipients selected.
                </p>
              </div>
              <img className="text-[24px] leading-5 font-bold text-blue w-6" src={CheckIcon} />
            </div>
          </div>
          {signers.map((signer, index) => (
            <SignerInput
              key={index}
              index={index}
              signer={signer}
              handleInputChange={handleInputChange}
              handleRemoveSigner={handleRemoveSigner}
            />
          ))}
        </div>
        <div className="flex items-center justify-center w-full p-[24px] bg-white">
          <Button
            text="Add Signer"
            disabled={false}
            isLoading={loading}
            onClick={handleAddSigner}
          />
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
            disabled={!isValid}
            isLoading={loading}
            onClick={handleSubmit}
          />
        </div>
      </section>
    </MyPage>
  );
};

export default AddNomineeRecipient;
