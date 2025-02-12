import CrossIcon from "@/assets/crossIcon.svg";
import RequestIcon from "@/assets/requestIcon.svg";
import SignIcon from "@/assets/signIcon.svg";
import { Chevron } from "@/assets/components/Chevron";
import { useState } from "react";
import Title from "./Title";
import RequestSignaturesStep from "./RequestSignaturesStep";
import SignDocument from "./SignDocument";
import { f7 } from "framework7-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  close: () => void;
}

export const AddDocumentModal = ({ isOpen, close }: AddDocumentModalProps) => {
  const [type, setType] = useState<"request" | "sign" | "main">("request");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1D56EE] mb-[47px] mx-4 rounded-[14px] w-full max-w-lg shadow-modal">
        {type !== "main" && <Title type={type} setType={setType} />}
        <div className="pt-7 pb-5">
          {
            {
              request: (
                <RequestSignaturesStep close={close} setType={setType} />
              ),
              sign: <SignDocument />,
              main: (
                <div className="flex flex-col items-center">
                  <div className="flex flex-col gap-6 max-w-[223px] mb-7 w-full">
                    <div
                      onClick={() => setType("request")}
                      className="flex gap-3 justify-between items-center"
                    >
                      <img src={RequestIcon} />
                      <p className="text-white w-full text-base leading-5 font-medium">
                        Request Signatures
                      </p>
                      <div className="w-[18px]">
                        <Chevron />
                      </div>
                    </div>
                    <div
                      onClick={() => {f7.views.main.router.navigate("/addNominee")}}
                      className="flex gap-3 justify-between items-center display-none"
                    >
                      <img src={SignIcon} />
                      <p className="text-white w-full text-base leading-5 font-medium">
                        Add Nominee
                      </p>
                      <div className="w-[18px]">
                        <Chevron />
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => close()}
                    className="bg-[#0A3DC7] rounded-full w-14 h-14 flex items-center justify-center -left-4 bottom-0"
                  >
                    <img src={CrossIcon} />
                  </div>
                </div>
              ),
            }[type]
          }
        </div>
      </div>
    </div>
  );
};
