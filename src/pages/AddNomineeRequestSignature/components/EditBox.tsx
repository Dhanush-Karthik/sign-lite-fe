import Date from "@/assets/components/Date";
import Delete from "@/assets/components/Delete";
import Initials from "@/assets/components/Initials";
import Required from "@/assets/components/Required";
import Signature from "@/assets/components/Signature";
import Textbox from "@/assets/components/Textbox";
import clsx from "clsx";

const EditBox = ({
  step,
  showSignIcon,
  deleteSign,
  isSignIconActive,
}: {
  step: "signStep" | "checkStep";
  showSignIcon: () => void;
  deleteSign: () => void;
  isSignIconActive: boolean;
}) => {
  const componentsMap: Record<string, JSX.Element> = {
    Signature: <Signature isActive={isSignIconActive} />,
    Initials: <Initials />,
    Date: <Date />,
    Textbox: <Textbox />,
    Delete: <Delete />,
    Required: <Required />,
  };
  const content = {
    signStep: ["Signature", "Initials", "Date", "Textbox"],
    checkStep: ["Delete", "Required"],
  }[step];

  return (
    <div
      className={clsx(
        "w-full h-[82px] py-[19px] px-[39px] bg-white rounded-[14px] border",
        "border-buttonContainer shadow-signatureRequest"
      )}
    >
      <div
        className={clsx(
          "flex items-center",
          step === "signStep" ? "justify-between" : "justify-center gap-6"
        )}
      >
        {content.map((name) => (
          <button
            key={name}
            className="w-[50px] flex flex-col gap-2 items-center justify-center"
            onClick={{ Signature: showSignIcon, Delete: deleteSign }[name]}
          >
            {componentsMap[name]}
            <p
              className={clsx(
                "text-[11px] leading-3",
                name === "Delete"
                  ? "text-deleteColor"
                  : (name === "Signature" && isSignIconActive)
                  ? "text-backButton"
                  : "text-gray"
              )}
            >
              {name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditBox;
