import React from "react";

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Modal = ({ children, title, subtitle }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white mx-4 my-auto px-4 py-6 rounded-[16px] w-full flex flex-col gap-6 items-center">
        <div>
          <p className="text-primaryTextColor text-base leading-normal mb-3 font-bold text-center">
            {title}
          </p>
          {subtitle && <p className="text-mainDarkBlue text-xs text-center">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};
