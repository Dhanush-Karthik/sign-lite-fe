import PendingSVG from "@/assets/StatusLogos/pending.svg";
import DraftSVG from "@/assets/StatusLogos/draft.svg";
import CompletedSVG from "@/assets/StatusLogos/completed.svg";
import MoreIcon from "@/assets/moreIcon.svg";
import { Fragment } from "react";
import { useAppSelector } from "@/core/redux/store";
import { f7, SkeletonBlock } from "framework7-react";
import { DocType } from "@/types";
import { Skeleton } from "@/components/Skeleton";
import NoDocs from "@/assets/components/NoDocs";

interface HomeProps {
  documents: DocType[];
}
const Home = ({ documents }: HomeProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const loading = useAppSelector((state) => state.loading.models.doc);
  const StatusMock = [
    {
      count: documents.filter((doc) => doc.status === "DRAFT").length,
      status: "Draft",
    },
    {
      count: documents.filter((item) => item.status === "PENDING" || item.isSigned === false)
        .length,
      status: "Pending",
    },
    {
      count: documents.filter((item) => item.status === "COMPLETED" || item.isSigned).length,
      status: "Completed",
    },
  ];

  return (
    <>
      <section title="top">
        <h1 className="text-primaryTextColor text-xl leading-[26px] font-bold pt-[10px] pb-[20px] px-4">{`Hello ${
          user?.name ?? "User"
        },`}</h1>
        <div className="flex gap-[14px] p-4">
          {StatusMock.map((item) => (
            <div
              className="p-3 bg-white w-[calc((100%-28px)/3)] h-[72px] rounded-[14px]"
              key={item.status}
            >
              <div className="flex justify-between mb-3 h-6 hidden">
                {loading ? (
                  <SkeletonBlock
                    slot="media"
                    tag={"a"}
                    width={"24px"}
                    height={"24px"}
                    effect={"wave"}
                    borderRadius={"6px"}
                  />
                ) : (
                  <p className=" font-medium leading-6 text-[24px]">{item.count}</p>
                )}
                <img
                  src={
                    {
                      Draft: DraftSVG,
                      Pending: PendingSVG,
                      Completed: CompletedSVG,
                    }[item.status]
                  }
                />
              </div>
              <p className="text-[12px] hidden">{item.status}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        title="content"
        className={`bg-white rounded-t-[20px] px-4 pt-6 overflow-hidden`}
        style={{
          height: `calc(100vh - 225px - ${safeAreas?.top ?? 0}px - 34px)`,
        }}
      >
        {/* <p className="mb-6 font-bold leading-[26px] text-xl">Recent activity</p> */}
        <div className="flex flex-col gap-5 items-end h-full overflow-scroll hidden">
          {loading ? (
            <Skeleton />
          ) : documents.length ? (
            documents
              .sort(
                (a, b) =>
                  new Date(b.status ? b.createdAt : b.document.createdAt).getTime() -
                  new Date(a.status ? a.createdAt : a.document.createdAt).getTime()
              )
              .map((item, key) => (
                <Fragment key={key}>
                  <div
                    onClick={() =>
                      f7.views.main.router.navigate("/details", {
                        props: { item },
                      })
                    }
                    className={`flex w-full gap-5 justify-between ${
                      key === documents.length - 1 && "mb-[100px]"
                    }`}
                  >
                    <div className="flex w-[calc(100%-50px)] gap-3">
                      <div
                        className={`p-3 rounded-xl w-[44px] h-[44px] flex justify-center items-center ${
                          item.status
                            ? {
                                DRAFT: "bg-[#e4eafe]",
                                PENDING: "bg-[#EF4B341F]",
                                COMPLETED: "bg-[#54BE8C1F]",
                              }[item.status]
                            : item.isSigned
                            ? "bg-[#54BE8C1F]"
                            : "bg-[#EF4B341F]"
                        }`}
                      >
                        <img
                          src={
                            item.status
                              ? {
                                  DRAFT: DraftSVG,
                                  PENDING: PendingSVG,
                                  COMPLETED: CompletedSVG,
                                }[item.status]
                              : item.isSigned
                              ? CompletedSVG
                              : PendingSVG
                          }
                          className="max-w-6"
                        />
                      </div>

                      <div className="w-full text-mainDarkBlue overflow-hidden">
                        <p className="mb-2 font-medium text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                          {item.file_original_name ?? item.document.file_original_name}
                        </p>
                        <div className="flex gap-2 items-center">
                          <p className="py-[2px] px-2 bg-[#63788e1f] rounded-[100px] w-fit text-[12px] leading-3">
                            {item.status
                              ? {
                                  DRAFT: "Draft",
                                  PENDING: "Waiting others to sign",
                                  COMPLETED: `Signed by ${item.signers[0].name}`,
                                }[item.status]
                              : item.isSigned
                              ? "Signed by You"
                              : "Need to sign"}
                          </p>
                          {item.status === "PENDING" && (
                            <>
                              <div className="w-[3px] h-[3px] bg-[#BBBBC3]" />
                              <p className="text-[#63788E] text-xs leading-normal">
                                from {item.signers[0].name}
                              </p>
                            </>
                          )}
                          {!item.isSigned && item.document && (
                            <>
                              <div className="w-[3px] h-[3px] bg-[#BBBBC3]" />
                              <p className="text-[#63788E] text-xs leading-normal">
                                from {item.document?.uploadedBy?.name}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <img src={MoreIcon} />
                      <p className="text-gray text-xs">
                        {new Date(item.createdAt ?? item.document.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-[calc(100%-52px)] border-b border-[#E6E8EA] ${
                      key === documents.length - 1 && "hidden"
                    }`}
                  />
                </Fragment>
              ))
          ) : (
            <div className="flex flex-col items-center gap-10 mt-[5rem]">
              <NoDocs />
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-mainBlack text-base font-medium">No Signature Documents!</p>
                <p className="text-gray text-sm text-center">
                  Signature Documents that have been added will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
