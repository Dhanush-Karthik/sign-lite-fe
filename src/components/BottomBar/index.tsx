import { DocumentsIcon } from "@/assets/components/DocumentsIcon";
import { HomeIcon } from "@/assets/components/HomeIcon";
import PlusIcon from "@/assets/plusIcon.svg";
import { Dispatch, SetStateAction } from "react";

interface BottomBarProps {
  open: () => void;
  setCurrentTab: Dispatch<SetStateAction<"home" | "documents">>;
  currentTab: "home" | "documents";
}
const BottomBar = ({ open, setCurrentTab, currentTab }: BottomBarProps) => {
  return (
    <section className={`flex bg-white absolute bottom-0 w-full border-t border-[#E7EDF3] z-10 pb-[34px]`}>
      <div className="w-full py-[10px] px-1">
        <div
          onClick={() => setCurrentTab("home")}
          className="w-full flex flex-col items-center gap-2"
        >
          <HomeIcon selected={currentTab === "home"} />
          <p className="text-mainDarkBlue text-[11px] font-bold leading-3">Requested</p>
        </div>
      </div>
      <div className=" py-[10px] px-1">
        <div onClick={open} className="w-full flex flex-col items-center gap-2">
          <div className="h-6 w-6 relative">
            <div className="bg-[#1D56EE] rounded-full w-14 h-14 absolute flex items-center justify-center -left-4 bottom-1">
              <img src={PlusIcon} />
            </div>
          </div>
          <p className="text-[#63788E] text-[11px] font-bold leading-3">Add</p>
        </div>
      </div>
      <div className="w-full py-[10px] px-1">
        <div
          onClick={() => setCurrentTab("documents")}
          className="w-full flex flex-col items-center gap-2"
        >
          <DocumentsIcon stroke="#63788E" selected={currentTab === "documents"} />
          <p className="text-[#63788E] text-[11px] font-bold leading-3">Assigned</p>
        </div>
      </div>
    </section>
  );
};

export default BottomBar;
