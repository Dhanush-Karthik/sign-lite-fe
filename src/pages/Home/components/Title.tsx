import Back from "@/assets/components/Back";
import RequestIcon from "@/assets/requestIcon.svg";
import { Dispatch, SetStateAction } from "react";

const Title = ({
  type,
  setType,
}: {
  type: "request" | "sign";
  setType: Dispatch<SetStateAction<"request" | "sign" | "main">>;
}) => {
  return (
    <>
      <div className="p-4 flex w-full gap-4 justify-between items-center">
        <Back onClick={() => setType("main")} stroke="#fff" />
        {
          {
            request: (
              <div className="flex gap-3 justify-between items-center">
                <img src={RequestIcon} />
                <p className="text-white w-full text-base leading-5 font-medium">
                  Request Signatures
                </p>
              </div>
            ),
            sign: (
              <div className="flex gap-3 justify-between items-center">
                <img src={RequestIcon} />
                <p className="text-white w-full text-base leading-5 font-medium">Sign Document</p>
              </div>
            ),
          }[type]
        }
        <div className="w-6"></div>
      </div>
    </>
  );
};

export default Title;
