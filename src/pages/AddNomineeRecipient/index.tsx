import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
import { f7 } from "framework7-react";
// import AddNomineeFieldsRecipientReviewStep from "@/components/AddNomineeFieldsRecipientReviewStep";
import SignerInput from "@/components/signerInput";

const AddNomineeRecipient = ({ f7router }: { f7router: Router.Router }) => {
  // const { isOpen, close, open } = useDisclosure();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const [isInputFocused] = useState(false);
  const loading = useAppSelector((state) => state.loading.models.contact);
  const dispatch = useAppDispatch();
  const [isValid, setIsValid] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("BVSign");
  // const [isOpen, setIsOpen] = useState(false);
  const [isSignersChanged, setIsSignerChanged] = useState(false);
  const docState = useAppSelector((state) => state.multidoc);

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
    setIsSignerChanged(true);
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
    setIsSignerChanged(true);
    const updatedSigners = signers.filter((_, i) => i !== index);
    setSigners(updatedSigners);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedSigners = signers.map((signer, i) =>
      i === index ? { ...signer, [field]: value } : signer
    );
    setSigners(updatedSigners);
  };

  const handleSubmit = () => {
    dispatch.multidoc.setDoc({signatureType: "BVSign", signers: signers});
    f7.views.main.router.navigate("/addNomineeRequestSignature");
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  // const options = [
  //   { value: "BVSign", label: "BVSign" },
  //   { value: "Yousign", label: "Yousign" },
  // ];

  // const handleOptionChange = (option: string) => {
  //   setSelectedOption(option);
  //   setIsOpen(false);
  // };


  useEffect(() => {
    const prevSigners: Signer[] = docState?.signers!;

    const isSigners = prevSigners.length > 0 && prevSigners.every(
      signer => Boolean(signer.name?.trim()) && Boolean(signer.email?.trim())
    );

    !isSignersChanged && isSigners && setSigners(prevSigners);

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
      {/* <AddNomineeFieldsRecipientReviewStep step="recipient" /> */}
      <section
        title="content"
        className={clsx(
          "bg-white rounded-t-[20px] flex flex-col",
          isInputFocused && "overflow-scroll"
        )}
        style={{
          height: `calc(100vh - 95px - ${safeAreas?.top ?? 0}px)`,
        }}
      >
        <div className="my-5 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-primaryTextColor text-xl font-bold px-4">Add Signers</h2>
              <p className="px-4 text-xs">Add one or more signers to the request</p>
            </div>
            <div className="flex justify-center items-center mr-4">
              <div onClick={handleAddSigner} className="bg-[#1D56EE] rounded-full w-9 h-9 flex items-center justify-center">
                  <p className="text-2xl text-white pb-[2px]">+</p>
                  {/* <img width={"20px"} height={"20px"} src={PlusIcon} /> */}
              </div>
            </div>
          {/* <div className="flex justify-center items-center">
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
          </div> */}
        </div>
        <div
          className={clsx(
            "pt-2 pb-6 px-4 flex-1 flex flex-col gap-6",
            !isInputFocused && "overflow-scroll"
          )}
        >
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
        <div className="w-full pt-[6px] pb-[2px] px-4 flex gap-4 border-t-2 bg-main border-buttonContainer">
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
