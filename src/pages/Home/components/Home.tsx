import PendingSVG from "@/assets/StatusLogos/pending.svg";
import DraftSVG from "@/assets/StatusLogos/draft.svg";
import CompletedSVG from "@/assets/StatusLogos/completed.svg";
import FailedSVG from "@/assets/StatusLogos/failed.svg";
import { Fragment, useState } from "react";
import { useAppSelector } from "@/core/redux/store";
import { f7, SkeletonBlock } from "framework7-react";
import { Skeleton } from "@/components/Skeleton";
import NoDocs from "@/assets/components/NoDocs";
import SearchIcon from "@/assets/searchIcon.svg";

interface ExecutionError {
  taskName: string;
  taskAssignee: string;
  error: string;
}

interface Activity {
  taskName: string;
  taskAssignee: string;
  executionDuration: string;
  startTime: string;
  endTime?: string; // Optional since "ACTIVE" status does not have an endTime
  status: "Ended" | "Active";
}

interface DocumentType {
  startTime: string;
  endTime?: string; // Optional since "ACTIVE" status does not have an endTime
  flowInstanceId: string;
  fileName:string;
  flowName: string;
  status: "ABORTED" | "ENDED" | "ACTIVE";
  executionError?: ExecutionError; // Optional because not all documents have this field
  activities: Activity[];
}

interface HomeProps {
  documents: DocumentType[];
}


const Home = ({ documents }: HomeProps) => {
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const loading = useAppSelector((state) => state.loading.models.doc);
  const [searchValue, setSearchValue] = useState<string>("");


  const [selectedStatusOption, setSelectedStatusOption] = useState<
      "All" | "Pending" | "Completed" | "Rejected"
    >("All");
  const StatusMock = [
    {
      count: documents.length,
      status: "All",
    },
    {
      count: documents.filter((item) => item.status === "ENDED")
        .length,
      status: "Completed",
    },
    {
      count: documents.filter((item) => item.status === "ACTIVE").length,
      status: "Pending",
    },
    {
      count: documents.filter((doc) => doc.status === "ABORTED").length,
      status: "Rejected",
    }
  ];

  const getStatus = (status: string) => {
    switch (status) {
      case "ABORTED":
        return "Rejected"
      case "ACTIVE":
        return "Pending"
      case "ENDED":
        return "Completed"
    }
  }

  const filteredDocuments = documents.filter((item) => {
    
    const status = getStatus(item.status);
    const matchesStatus =
      selectedStatusOption === "All" ? true : status === selectedStatusOption;

    const matchesSearch = searchValue
      ? item.fileName?.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const groupByDate = (items: DocumentType[]) => {
    const grouped: {
      [key: string]: DocumentType[];
    } = {};

    items.forEach((item) => {
      const date = new Date();  // You might want to add createdAt to your document type
      const key = date.toDateString();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return grouped;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const groupedData = groupByDate(filteredDocuments);

  return (
    <>
      <section title="top">
        {/* <h1 className="text-primaryTextColor text-xl leading-[26px] font-bold pt-[25px] pb-[5px] px-4">{`Hello ${
          user?.name ?? "User"
        },`}</h1> */}
        <div className="text-2xl font-bold pt-6 pl-4">Requested Documents</div>
        <div className="flex gap-[14px] p-4">
          {StatusMock.map((item) => {
            if(item.status==="All") return;
            return (<div
              className="p-3 bg-white w-[calc((100%-28px)/3)] h-[72px] rounded-[14px]"
              key={item.status}
            >
              <div className="flex justify-between mb-3 h-6">
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
                      Rejected: FailedSVG
                    }[item.status]
                  }
                />
              </div>
              <p className="text-[12px]">{item.status}</p>
            </div> 
          )
          })}
        </div>
        <div className="relative px-4 mb-3">
          <img
            className="absolute inset-y-0 left-4 top-[10px] flex items-center pl-3"
            src={SearchIcon}
          />
          <input
            type="search"
            onChange={handleSearch}
            placeholder="Search document here..."
            className="!bg-white !rounded-[999px] !p-[10px] !pl-10 !w-full !border-none"
          />
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
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 mb-5 whitespace-nowrap">
            {StatusMock.map((item) =>
              loading ? (
                <SkeletonBlock
                  key={item.status}
                  slot="media"
                  tag={"a"}
                  width={"80px"}
                  height={"32px"}
                  effect={"wave"}
                  borderRadius={"100px"}
                />
              ) : (
                <div
                  key={item.status}
                  onClick={() =>
                    setSelectedStatusOption(
                      item.status as "All" | "Pending" | "Completed" | "Rejected"
                    )
                  }
                  className={`px-[14px] rounded-[100px] py-[6px] flex gap-[6px] items-center ${
                    item.status === selectedStatusOption
                      ? "bg-mainDarkBlue"
                      : "border border-defaultBorder"
                  }`}
                >
                  <p
                    className={`text-sm text-mainDarkBlue opacity-60 ${
                      item.status === selectedStatusOption && "font-bold text-white opacity-100"
                    }`}
                  >
                    {item.status==="Failed"? "Failed/Rejected": item.status}
                  </p>
                  {item.status === selectedStatusOption && (
                    <div className="px-2 py-[2px] text-xs leading-3 font-bold flex items-center bg-white rounded-[100px]">
                      {item.count}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end h-full overflow-scroll">
          {loading ? (
            <Skeleton />
          ) : Object.keys(groupedData).length ? (
            Object.keys(groupedData)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map((key) => (
                groupedData[key].map((item, index2) => (
                  <Fragment key={index2}>
                    <div
                      onClick={async () => {
                        f7.views.main.router.navigate("/details/viewdoc", {
                          props: { requestedItem: item },
                        })
                      }
                      }
                      className={`flex w-full gap-5 justify-between ${
                        index2 === documents.length - 1 && "mb-[150px]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-xl w-[44px] h-[44px] flex justify-center items-center ${
                            item.status
                              ? {
                                  ABORTED: "bg-[#EF4B341F]",
                                  ACTIVE: "bg-[#FEF3C7]",
                                  ENDED: "bg-[#54BE8C1F]",
                                }[item.status]
                              // : item.isSigned
                              // ? "bg-[#54BE8C1F]"
                              : "bg-[#EF4B341F]"
                          }`}
                        >
                          <img
                            src={
                              item.status
                                ? {
                                    ABORTED: FailedSVG,
                                    ACTIVE: PendingSVG,
                                    ENDED: CompletedSVG,
                                  }[item.status]
                                // : item.isSigned
                                // ? CompletedSVG
                                : PendingSVG
                            }
                            className="max-w-6"
                          />
                        </div>

                        <div className="w-full text-mainDarkBlue overflow-hidden">
                          <p className="font-medium text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                            {item.fileName??"Document.pdf"}
                          </p>
                          <div className="flex-col gap-3 items-center">
                            <div className="text-[#63788E] mb-2 text-xs leading-normal">
                            {item.status
                            ? {
                                ABORTED: "Signature request is rejected",
                                ACTIVE: `Current signer - ${item.activities[0].taskAssignee}`,
                                ENDED: `Document is signed by all assigners`,
                              }[item.status]
                            : `from ${item.activities[0].taskAssignee}`}
                            </div>
                            <div className="py-[2px] px-2 bg-[#63788e1f] rounded-[100px] w-fit text-[12px] ">
                            {item.status
                            ? {
                                ABORTED: "Failed/Rejected",
                                ACTIVE: "Pending",
                                ENDED: `Completed`,
                              }[item.status]
                            // : item.isSigned
                            // ? "Signed by You"
                            : "Need to sign"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray text-xs">
                          {new Date(item.startTime).toLocaleTimeString(
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
                        index2 === documents.length - 1 && "hidden"
                      }`}
                    />
                  </Fragment>
                ))
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
