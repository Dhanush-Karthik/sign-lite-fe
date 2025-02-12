import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <p className="text-gray text-xs leading-4 font-medium mb-2">{label}</p>
      <input
        className="!bg-white !rounded-xl !px-[16px] !py-[12px] h-10 !w-full placeholder:text-xs placeholder:text-[#B6C0CB]"
        {...props}
      />
    </div>
  );
};
