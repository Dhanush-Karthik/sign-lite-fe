import { IoIosMail, IoIosMailOpen } from "react-icons/io";

interface MailIconProps {
    selected?: boolean;
  }
  export const MailIcon = ({ selected = false }: MailIconProps) => {
    return (
      <>
        {selected ? (
          <IoIosMailOpen  width="25" height="24" size={25} color="#051A30" />
        ) : (
            <IoIosMail  width="25" height="30" size={25} color="#63788E" />
        )}
      </>
    );
  };