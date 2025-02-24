import PendingSVG from "@/assets/StatusLogos/pending.svg";
import InitiatedSVG from "@/assets/StatusLogos/draft.svg"; // Reusing draft icon for initiated
import CompletedSVG from "@/assets/StatusLogos/completed.svg";
import MoreIcon from "@/assets/moreIcon.svg";
import { Fragment, useState } from "react";
import SearchIcon from "@/assets/searchIcon.svg";
import { f7 } from "framework7-react";
import { useAppSelector } from "@/core/redux/store";
import { Skeleton } from "@/components/Skeleton";
import { SkeletonBlock } from "framework7-react";
import NoDocs from "@/assets/components/NoDocs";
import { API_PATHS } from "@/constants";
import { miniappClient } from "@/core/miniappClient";
//import { SECURE_CHAT_SHARE_URL } from "@/constants";

interface DocumentType {
  id: string;
  signer_id: string;
  process_instance_id: string;
  file_name: string;
  task_id: string;
  status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "DRAFT";
}

interface DocumentsProps {
  documents: DocumentType[];
}

export const Documents = ({ documents }: DocumentsProps) => {
  const [selectedStatusOption, setSelectedStatusOption] = useState<
    "All" | "Initiated" | "Pending" | "Completed"
  >("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSignPopup, setShowSignPopup] = useState({ show: false, message: "success", showSignBtn: true, heading : ""});
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const loading = useAppSelector((state) => state.loading.models.doc);

  const StatusMock = [
    {
      count: documents.filter((item) =>
        item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      ).length,
      status: "All",
    },
    {
      count: documents.filter(
        (item) =>
          item.status === "INITIATED" &&
          item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      ).length,
      status: "Initiated",
    },
    {
      count: documents.filter(
        (item) =>
          item.status === "PENDING" &&
          item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      ).length,
      status: "Pending",
    },
    {
      count: documents.filter(
        (item) =>
          item.status === "COMPLETED" &&
          item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      ).length,
      status: "Completed",
    },
  ];

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

  const getDateTitle = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    }
  };

  const filteredDocuments = documents.filter((item) => {
    const matchesStatus =
      selectedStatusOption === "All" ? true : item.status === selectedStatusOption.toUpperCase();

    const matchesSearch = searchValue
      ? item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const groupedData = groupByDate(filteredDocuments);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSignDocument = async () => {
    if (!selectedDocument) return;

    try {
      const url = `${API_PATHS.PUSH_DOC_TO_CHAT}`.replace("email", selectedDocument.signer_id);
      console.log(url);
      const response : {message : String} = await miniappClient.post(
        url,
        JSON.stringify({
          processInstanceId: selectedDocument.process_instance_id,
          taskId: selectedDocument.task_id,
          userId: selectedDocument.signer_id,
          documentName: selectedDocument.file_name,
        })
      );

      if (response.message?.toLowerCase() === "document push success") {
         //window.location.replace(SECURE_CHAT_SHARE_URL);
         setShowSignPopup({ show: true, message: "Successfully pushed the document to secure chat ", showSignBtn: false, heading: ""});
      } else if (response.message?.toLowerCase() === "pending task already exists for the user") {
        setShowSignPopup({ show: true, message: "Please complete or reject the pending document", showSignBtn: false, heading: "Previous Document Pending"});
      }
    } catch (error) {
      setShowSignPopup({ show: true, message: "Oops, Something went wrong!", showSignBtn: false, heading: ""});
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "INITIATED":
        return {
          icon: InitiatedSVG,
          bgColor: "bg-[#e4eafe]"
        };
      case "PENDING":
        return {
          icon: PendingSVG,
          bgColor: "bg-[#EF4B341F]"
        };
      case "COMPLETED":
        return {
          icon: CompletedSVG,
          bgColor: "bg-[#54BE8C1F]"
        };
      default:
        return {
          icon: PendingSVG,
          bgColor: "bg-[#EF4B341F]"
        };
    }
  };

  return (
    <>
      <section title="top">
        <div className="pt-[3px] pb-[13px] h-14 px-4">
          {loading ? (
            <SkeletonBlock
              slot="media"
              tag={"a"}
              width={"298px"}
              height={"41px"}
              effect={"wave"}
              borderRadius={"100px"}
            />
          ) : (
            <div className="relative w-[calc(100%-100px)]">
              <img
                className="absolute inset-y-0 left-0 top-[10px] flex items-center pl-3"
                src={SearchIcon}
              />
              <input
                type="search"
                onChange={handleSearch}
                placeholder="Search document here..."
                className="!bg-white !rounded-[999px] !p-[10px] !pl-10 !w-full !border-none"
              />
            </div>
          )}
        </div>
      </section>
      <section
        title="content"
        className="bg-white flex flex-col rounded-t-[20px] px-4 pt-6"
        style={{
          height: `calc(100vh - 187px - ${safeAreas?.top ?? 0}px - 34px)`,
        }}
      >
        <div className="w-full flex gap-2 mb-6">
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
                    item.status as "All" | "Initiated" | "Pending" | "Completed"
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
                  {item.status}
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
        {loading ? (
          <Skeleton documentPage />
        ) : documents.length ? (
          <div className="flex flex-col items-end flex-1 overflow-scroll">
            {Object.keys(groupedData)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((key, index) => (
                <div className="w-full" key={key}>
                  <h2 className="text-sm font-medium leading-normal hidden">
                    {getDateTitle(new Date(key))}
                  </h2>
                  {groupedData[key].map((item, index2) => (
                    <Fragment key={index2}>
                      <div
                        onClick={() =>
                          f7.views.main.router.navigate("/details", {
                            props: { item },
                          })
                        }
                        className={`flex w-full gap-5 mt-4 justify-between ${
                          index === Object.keys(groupedData).length - 1 &&
                          index2 === groupedData[key].length - 1 &&
                          "mb-[50px]"
                        }`}
                      >
                        <div className="flex w-[calc(100%-50px)] gap-3">
                          <div
                            className={`p-3 rounded-xl w-[44px] h-[44px] flex justify-center items-center ${
                              getStatusIcon(item.status).bgColor
                            }`}
                          >
                            <img
                              src={getStatusIcon(item.status).icon}
                              className="max-w-6"
                            />
                          </div>

                          <div className="w-full text-mainDarkBlue overflow-hidden">
                            <p className="mb-2 font-medium text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.file_name}
                            </p>
                            <div className="flex gap-2 items-center">
                              <p className="py-[2px] px-2 bg-[#63788e1f] rounded-[100px] w-fit text-[12px] leading-3">
                                {item.status === "INITIATED"
                                  ? "To be signed"
                                  : item.status === "PENDING"
                                  ? "Pending"
                                  : "Completed"}
                              </p>
                              <div className="w-[3px] h-[3px] bg-[#BBBBC3]" />
                              <p className="text-[#63788E] text-xs leading-normal">
                                from {item.signer_id}
                              </p>
                            </div>
                          </div>
                        </div>

                        {item.status === "INITIATED" && (
                          <div className="flex flex-col items-end gap-2">
                            <img 
                              src={MoreIcon} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDocument(item);
                                setShowSignPopup({ show: true, message: "Are you sure you want to sign the document?", showSignBtn: true, heading: ""});
                              }}
                            />
                            <p className="text-gray text-xs hidden">
                              {new Date().toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-[calc(100%-52px)] border-b my-5 float-end border-[#E6E8EA] ${
                          index === Object.keys(groupedData).length - 1 &&
                          index2 === groupedData[key].length - 1 &&
                          "hidden"
                        }`}
                      />
                    </Fragment>
                  ))}
                </div>
              ))}
          </div>
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
      </section>

      {/* Sign Document Popup */}
      {showSignPopup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-md">
            <h3 className="flex justify-center text-lg font-bold mb-4">{showSignPopup.heading}</h3>
            <h3 className="flex justify-center text-lg font-medium mb-4">{showSignPopup.message}</h3>
            <div className="flex justify-center gap-4 mt-6">
              {showSignPopup.showSignBtn && (
                <button
                  onClick={handleSignDocument}
                  className="px-4 py-2 bg-[#1D56EE] text-white rounded-lg transition duration-200 hover:bg-[#1540B2] active:bg-[#12369B]"
                >
                  Yes, Sign
                </button>
              )}
              <button
                onClick={() => setShowSignPopup({ show: false, message: "Please complete are reject the existing pending document", showSignBtn: false, heading: ""})}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg transition duration-200 hover:bg-gray-200 active:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};