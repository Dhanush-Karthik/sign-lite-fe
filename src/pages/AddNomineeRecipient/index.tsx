import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
import { f7 } from "framework7-react";
import AddNomineeFieldsRecipientReviewStep from "@/components/AddNomineeFieldsRecipientReviewStep";
import SignerInput from "@/components/signerInput";

const AddNomineeRecipient = ({ f7router }: { f7router: Router.Router }) => {
  // const { isOpen, close, open } = useDisclosure();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const [isInputFocused] = useState(false);
  const loading = useAppSelector((state) => state.loading.models.contact);
  const dispatch = useAppDispatch();
  const [isValid, setIsValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState("BVSign");
  const [isOpen, setIsOpen] = useState(false);

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
    dispatch.multidoc.setDoc({signatureType: selectedOption, signers: signers});
    f7.views.main.router.navigate("/addNomineeRequestSignature");
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const options = [
    { value: "BVSign", label: "BVSign" },
    { value: "Yousign", label: "Yousign" },
  ];

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const isFormValid = signers.length>0 && signers.every(
      (signer) =>
        signer.name.trim() !== "" &&
        signer.email.trim() !== "" 
        && isValidEmail(signer.email)
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
        <h2 className="text-primaryTextColor text-xl font-bold px-4">Add Signers</h2>
        <div
          className={clsx(
            "py-6 px-4 flex-1 flex flex-col gap-6",
            !isInputFocused && "overflow-scroll"
          )}
        >
          <div className="mt-6">
      <p className="text-gray-700 text-sm font-medium mb-2">
        Select signature method
      </p>
      <div className="relative">
        <button
          className="w-full flex items-center justify-between px-4 py-2 border border-blue-500 rounded-lg text-blue-500 font-medium bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedOption}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  selectedOption === option.value
                    ? "bg-blue-100 text-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
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
