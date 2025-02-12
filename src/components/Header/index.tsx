import Back from "@/assets/components/Back";
import clsx from "clsx";

const Header = ({
  title,
  className = "",
  back,
}: {
  title: string;
  className?: string;
  back: () => void;
}) => {
  return (
    <div className={clsx("flex items-center px-4 pt-6 pb-6", className)}>
      {back && (
        <div onClick={back}>
          <Back />
        </div>
      )}
      <p
        className={clsx(
          "text-base leading-[21px] font-medium text-primaryTextColor flex-1 text-center pr-[46px]"
        )}
      >
        {title}
      </p>
    </div>
  );
};

export default Header;
