import Fields from "@/assets/components/Fields";
import RecipientStep2 from "@/assets/components/RecipientStep2";
import RecipientStep3 from "@/assets/components/RecipientStep3";
import ReviewStep2 from "@/assets/components/ReviewStep2";
import ReviewStep3 from "@/assets/components/ReviewStep3";
import clsx from "clsx";

const FieldsRecipientReviewStep = ({ step }: { step: "recipient" | "review" }) => {
  return (
    <div className="my-5 mx-auto relative flex gap-7 w-min">
      <div className="flex flex-col gap-2 w-[60px] justify-center items-center">
        <Fields />
        <p className="text-primaryTextColor text-xs leading-3 opacity-80">Fields</p>
      </div>
      <div className="flex flex-col gap-2 w-[60px] justify-center items-center">
        {{ recipient: <RecipientStep2 />, review: <RecipientStep3 /> }[step]}
        <p
          className={clsx(
            "text-xs leading-3 opacity-80",
            step === "review" ? "text-primaryTextColor font-normal" : "text-backButton font-medium"
          )}
        >
          Recipient
        </p>
      </div>
      <div className="flex flex-col gap-2 w-[60px] justify-center items-center">
        {{ recipient: <ReviewStep2 />, review: <ReviewStep3 /> }[step]}
        <p
          className={clsx(
            "text-xs leading-3 opacity-80",
            step === "recipient"
              ? "text-primaryTextColor font-normal"
              : "text-backButton font-medium"
          )}
        >
          Review
        </p>
      </div>
      <div
        className={clsx(
          "absolute h-[1.5px] w-[40px] left-[54px] top-4",
          step === "review" ? "bg-lineGrey" : "bg-blue"
        )}
      />
      <div
        className={clsx(
          "absolute h-[1.5px] w-[40px] right-[54px] top-4",
          step === "recipient" ? "bg-lineGrey" : "bg-blue"
        )}
      />
    </div>
  );
};

export default FieldsRecipientReviewStep;
