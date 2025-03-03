import { FaSignature } from "react-icons/fa6";

interface MailIconProps {
    selected?: boolean;
  }
  export const SignatureIcon = ({ selected = false }: MailIconProps) => {
    return (
      <>
        {selected ? (
          <FaSignature  width="25" height="24" size={25} color="#051A30" />
        ) : (
          <FaSignature  width="25" height="30" size={25} color="#63788E" />
        )}
      </>
    );
};