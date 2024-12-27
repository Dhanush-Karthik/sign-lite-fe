import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import MeandOther from "@/assets/meandOther.svg";
import CheckIcon from "@/assets/checkIcon.svg";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
import axios from "axios";
import { f7 } from "framework7-react";
import AddNomineeFieldsRecipientReviewStep from "@/components/AddNomineeFieldsRecipientReviewStep";
import { API_BASE_URL } from "@/constants";

const AddNomineeRecipient = ({ f7router }: { f7router: Router.Router }) => {
  // const { isOpen, close, open } = useDisclosure();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const docState = useAppSelector((state) => state.doc);
  const loading = useAppSelector((state) => state.loading.models.contact);
  const user = useAppSelector((state) => state.auth.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputsValue, setInputsValue] = useState({
    name: docState?.name || "",
    email: docState?.email || "",
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedFile) {
      dispatch.doc.setDoc({ signatureFile: selectedFile });
      f7.views.main.router.navigate("/addNomineeRequestSignature");
    }
  }, [selectedFile]);

  const generatePdf = async () => {
    const { ...payload } = docState;
  
    // Define the request body with appropriate types
    const requestBody = {
      accountNumber: "1234567890",
      accountHolderName: user?.name,
      accountHolderUserId: user?.email,
      nomineeName: `${payload.name}`,
      nomineeUserId: `${payload.email}`
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generatePdf`, requestBody, {
        responseType: "blob",
      });
      console.log("Response", response.data);
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfFile = new File([pdfBlob], `${requestBody.accountHolderName}.pdf`, {
        type: "application/pdf",
      });
  
      setSelectedFile(pdfFile);
    } catch (error: any) {
      if (error.response) {
        console.error("Error Status:", error.response.status);
        console.error("Error Data:", error.response.data);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    }
  };

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
            onClick={generatePdf}
          />
        </div>
      </section>
    </MyPage>
  );
};

export default AddNomineeRecipient;
