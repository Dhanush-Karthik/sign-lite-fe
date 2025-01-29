import { Input } from "@/components/Input";
import React from "react";

interface SignerInputProps {
  index: number;
  signer: { name: string; email: string };
  handleInputChange: (index: number, field: string, value: string) => void;
  handleRemoveSigner: (index: number) => void;
}

const SignerInput: React.FC<SignerInputProps> = ({ index, signer, handleInputChange, handleRemoveSigner, }) => {

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between pr-3">
        <p className="text-sm font-medium text-primaryTextColor">Signer {index + 1}</p>
        <button
          className="text-red-500"
          onClick={() => handleRemoveSigner(index)}
        >X</button>
      </div>
      <Input
        label="Name"
        type="text"
        placeholder="Enter recipient name"
        value={signer.name}
        onChange={(e) => handleInputChange(index, "name", e.target.value.trim())}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="Enter recipient email address"
        value={signer.email}
        onChange={(e) => handleInputChange(index, "email", e.target.value)}
      />
    </div>
  );
};

export default SignerInput;