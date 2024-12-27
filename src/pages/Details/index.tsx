import Header from "@/components/Header";
import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import FileIcon from "@/assets/detailsFileIcon.svg";
import EyeIcon from "@/assets/eye.svg";
import DownloadDisabled from "@/assets/downloadDisabled.svg";
import Button from "@/components/Button";
import { useAppSelector } from "@/core/redux/store";
import { DocType } from "@/types";
import { CHAT_SERVİCE_SHARE_URL } from "@/constants";

export const Details = ({ f7router, item }: { f7router: Router.Router; item: DocType }) => {
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <MyPage name="details">
      <Header title="Details" back={() => f7router.back()} />

      <section
        title="content"
        className="bg-white rounded-t-[20px] px-4 pt-6 flex flex-col gap-6"
        style={{
          height: `calc(100vh - 121px - 34px - ${safeAreas?.top ?? 0}px)`,
        }}
      >
        <div className="w-full border border-defaultBorder rounded-xl py-3 px-4 flex gap-3">
          <div className="p-[10px] rounded-xl bg-[#63788E1F] shrink-0">
            <img src={FileIcon} />
          </div>

          <div className="flex flex-col gap-2 overflow-hidden">
            <p className="text-mainDarkBlue text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden">
              {item.file_original_name ?? item.document.file_original_name}
            </p>
            <p className="py-[2px] px-2 bg-[#63788E1F] text-xs leading-3 text-mainDarkBlue w-fit rounded-[100px]">
              Need to Sign
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() =>
              f7router.navigate("/details/viewdoc", {
                props: { item },
              })
            }
            className=" py-[14px] rounded-[100px] border border-buttonContainer flex gap-2 items-center justify-center w-full"
          >
            <img src={EyeIcon} />
            <p className="text-blue text-sm font-bold">View Docs</p>
          </button>
          <div className="py-[14px] rounded-[100px] border border-buttonContainer flex gap-2 items-center justify-center w-full">
            <img src={DownloadDisabled} />
            <p className="text-[#E1E4EA] text-sm font-bold">Download</p>
          </div>
        </div>
        <div className="flex flex-col gap-[15px]">
          <div>
            <p className="text-xs text-gray mb-1">Sender</p>
            <p className="text-sm text-mainDarkBlue font-medium">
              {item.status
                ? `${user?.name} ${user?.surname}`
                : `${item.document.uploadedBy.name} ${item.document.uploadedBy.surname}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray mb-1">Email</p>
            <p className="text-sm text-mainDarkBlue font-medium">
              {item.status ? user?.email : item.document.uploadedBy.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray mb-1">Received</p>
            <div className="text-sm text-mainDarkBlue font-medium flex gap-1 items-center">
              <p>
                {new Date(item.createdAt ?? item.document.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="w-[3px] h-[3px] bg-[#BBBBC3]" />
              <p>
                {new Date(item.createdAt ?? item.document.createdAt)
                  .toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(":", ".")}
              </p>
            </div>
          </div>
        </div>
        <div className="border-b w-full border-[#E6E8EA]" />
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Recipient</p>
          <div className="flex gap-3 items-center">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#E4EBFD]">
              <span className="text-[24px] leading-5 font-bold text-blue">
                {((item.status ? item.signers[0].name : user?.name) ?? "")
                  .charAt(0)
                  .toLocaleUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-mainDarkBlue text-sm font-medium">
                {item.status ? item.signers[0].name : user?.name}
              </p>
              <p className="text-gray text-xs leading-normal">
                {item.status ? item.signers[0].email : user?.email}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section title="bottom" className="pb-[34px] w-full">
        <div className="border-t border-[#E7EDF3] py-2 px-4">
          <Button
            text="Sign"
            onClick={() => window.location.replace(CHAT_SERVİCE_SHARE_URL)}
            disabled={!!item.status || item.isSigned}
          />
        </div>
      </section>
    </MyPage>
  );
};
