// import Spinner from "@/components/Spinner";
import clsx from "clsx";

const Button = ({
  text,
  isLoading,
  disabled,
  onClick,
  className,
  type = "default",
}: {
  text: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "default" | "previous";
  onClick: () => void;
}) => {
  return (
    <button
      className={clsx(
        "w-full rounded-full py-[14px] px-10 font-bold flex items-center justify-center text-sm",
        type !== "previous"
          ? isLoading || disabled
            ? "text-white bg-okButtonDisabled"
            : "text-white bg-okButtonEnabled"
          : "text-backButton border-2 !py-3 border-buttonContainer",
        className
      )}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? (text === "Send" ? "Sending..." : text) : text}
    </button>
  );
};

export default Button;
