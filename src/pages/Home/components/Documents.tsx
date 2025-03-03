import PendingSVG from "@/assets/StatusLogos/pending.svg";
import InitiatedSVG from "@/assets/StatusLogos/draft.svg"; // Reusing draft icon for initiated
import CompletedSVG from "@/assets/StatusLogos/completed.svg";
import FailedSVG from "@/assets/StatusLogos/failed.svg";
import SignatureIcon from "@/assets/documentsign.svg";
import { Fragment, useRef, useState } from "react";
import SearchIcon from "@/assets/searchIcon.svg";
import { f7 } from "framework7-react";
import { useAppSelector } from "@/core/redux/store";
import { Skeleton } from "@/components/Skeleton";
import { SkeletonBlock } from "framework7-react";
import NoDocs from "@/assets/components/NoDocs";
import { API_PATHS } from "@/constants";
import { miniappClient } from "@/core/miniappClient";
import { SECURE_CHAT_SHARE_URL } from "@/constants";
import Spinner from "@/components/Spinner";

interface DocumentType {
  id: string;
  signer_id: string;
  process_instance_id: string;
  requester: string;
  file_name: string;
  task_id: string;
  status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "DRAFT";
}

interface DocumentsProps {
  documents: DocumentType[];
}

export const Documents = ({ documents }: DocumentsProps) => {
  const [selectedStatusOption, setSelectedStatusOption] = useState<
    "All" | "Initiated" | "Pending" | "Completed" | "Failed"
  >("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSignPopup, setShowSignPopup] = useState({ show: false, message: "success", primaryButtonText: "", secondaryButtonText:"",  showSignBtn: true, heading : "", isPending: false});
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const loading = useAppSelector((state) => state.loading.models.doc);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    {
      count: documents.filter(
        (item) =>
          item.status === "FAILED" &&
          item.file_name.toLowerCase().includes(searchValue.toLowerCase())
      ).length,
      status: "Failed",
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

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowSignPopup({
        show: false,
        message: "",
        primaryButtonText: "",
        secondaryButtonText: "",
        showSignBtn: false,
        heading: "",
        isPending: false
      });
    }
  };

  const groupedData = groupByDate(filteredDocuments);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSignDocument = async (isPending: boolean, primaryButtonText : string) => {
    if (!selectedDocument) return;

    if(isPending) {
      // Confirmation step after user selecting "No, Cancel Request"
      if(primaryButtonText === "Yes, Continue") {
        const url = `${API_PATHS.CONTINUE_DOC_TO_CHAT}`.replace("email", selectedDocument!.signer_id);
        await miniappClient.post(
          url,
          JSON.stringify({
            processInstanceId: selectedDocument!.process_instance_id,
            taskId: selectedDocument!.task_id,
            userId: selectedDocument!.signer_id,
            documentName: selectedDocument!.file_name,
          })
        );

        window.location.replace(SECURE_CHAT_SHARE_URL);
        return;
      }

      // Confirmation step after user selecting "No, Cancel Request"
      if (primaryButtonText === "Yes, Cancel") {
        try {
          setIsLoading(true);
          const url = `${API_PATHS.PUSH_DOC_TO_CHAT}`.replace("email", selectedDocument!.signer_id) + "?reject=true";
          console.log(url);
          await miniappClient.post(
            url,
            JSON.stringify({
              processInstanceId: selectedDocument!.process_instance_id,
              taskId: selectedDocument!.task_id,
              userId: selectedDocument!.signer_id,
              documentName: selectedDocument!.file_name,
            })
          );
    
          setShowSignPopup({ show: true, message: "The signature request is rejected successfully", primaryButtonText:"", secondaryButtonText: "Close", showSignBtn: false, heading: "Request rejected", isPending: false});
        } catch (error) {
          setShowSignPopup({ show: true, message: "Oops, Something went wrong!", primaryButtonText:"Yes, Sign", secondaryButtonText: "Close", showSignBtn: false, heading: "", isPending: false});
        } finally {
          setIsLoading(false);
        }

        return;
      }
    }

    try {
      setIsLoading(true);
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
         window.location.replace(SECURE_CHAT_SHARE_URL);
      } else if (response.message?.toLowerCase() === "pending task already exists for the user") {
        setShowSignPopup({ show: true, message: "Please complete or reject the pending document", primaryButtonText:"Yes, Sign", secondaryButtonText: "Close", showSignBtn: false, heading: "Previous Document Pending", isPending: false});
      }
    } catch (error) {
      setShowSignPopup({ show: true, message: "Oops, Something went wrong!", primaryButtonText:"Yes, Sign", secondaryButtonText: "Close", showSignBtn: false, heading: "", isPending: false});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecondaryButtonClick = async (isReject: boolean, heading: string) => {
    if(heading==="Request rejected") {
      window.location.reload();
      return;
    }

    if(!isReject || heading === "Cancel Request") {
      setShowSignPopup({show: false, message: "", primaryButtonText: "", secondaryButtonText: "", showSignBtn: false, heading: "", isPending: false});
      return;
    }

    setShowSignPopup({show: true, message: "Are you sure you want to cancel the signature request?", primaryButtonText: "Yes, Cancel", secondaryButtonText: "Close", showSignBtn: true, heading: "Cancel Request", isPending: true});
    return;
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
          bgColor: "bg-[#FEF3C7]"
        };
      case "COMPLETED":
        return {
          icon: CompletedSVG,
          bgColor: "bg-[#54BE8C1F]"
        };
      case "FAILED":
        return {
          icon: FailedSVG,
          bgColor: "bg-[#EF4B341F]"
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
      {isLoading && 
        <div className="">
          <Spinner isFull={false} />
        </div>
      }
      <section title="top">
        <div className="mb-3  px-4">
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
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-bold">
                Inbox
              </div>
              <div className="relative ">
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
            </div>
          )}
        </div>
      </section>
      <section
        title="content"
        className="bg-white flex flex-col rounded-t-[20px] px-4 pt-6"
        style={{
          height: `calc(100vh - 110px - ${safeAreas?.top ?? 0}px - 34px)`,
        }}
      >
        <div className="w-full overflow-x-auto">
        <div className="flex gap-2 mb-2 whitespace-nowrap">
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
                    item.status as "All" | "Initiated" | "Pending" | "Completed" | "Failed"
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
        {loading ? (
          <Skeleton documentPage />
        ) : documents.length ? (
          <div className="flex flex-col items-end flex-1 overflow-scroll mb-[75px]">
            {Object.keys(groupedData)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map((key, index) => (
                <div className="w-full" key={key}>
                  <h2 className="text-sm font-medium leading-normal hidden">
                    {getDateTitle(new Date(key))}
                  </h2>
                  {groupedData[key].map((item, index2) => (
                    <Fragment key={index2}>
                      <div
                        onClick={async () => {
                          f7.views.main.router.navigate("/details/viewdoc", {
                            props: { item },
                          })
                        }}
                        className={`flex w-full gap-5 mt-4 justify-between ${
                          index === Object.keys(groupedData).length - 1 &&
                          index2 === groupedData[key].length - 1 &&
                          "mb-[50px]"
                        }`}
                      >
                        <div className="flex w-[calc(100%-50px)] gap-3">
                          <div className="flex items-center">
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
                          </div>
                          <div className="w-full text-mainDarkBlue overflow-hidden">
                            <div className="font-medium text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.file_name}
                            </div>
                            <div className="flex-col gap-3 items-center">
                              <div className="text-[#63788E] mb-2 text-xs leading-normal">
                                from {item.requester??"User"}
                              </div>
                              <div className="py-[2px] px-2 bg-[#63788e1f] rounded-[100px] w-fit text-[12px] ">
                                {item.status === "INITIATED"
                                  ? "To be signed"
                                  : item.status === "PENDING"
                                  ? "Pending"
                                  : item.status === "FAILED" 
                                  ? "Failed/Rejected"
                                  : "Completed"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {
                          !(item.status === "COMPLETED" || item.status === "FAILED") && 
                            <div className="flex flex-col items-center justify-center gap-2 pr-3">
                              <img 
                                width={"20px"}
                                src={SignatureIcon} 
                                onClick={(e) => {
                                  if(item.status === "INITIATED") {
                                    e.stopPropagation();
                                    setSelectedDocument(item);
                                    setShowSignPopup({ show: true, message: "Are you sure you want to sign the document?", primaryButtonText:"Yes, Sign", secondaryButtonText: "Close", showSignBtn: true, heading: "Action required", isPending: false});
                                  }
        
                                  if(item.status === "PENDING") {
                                    e.stopPropagation();
                                    setSelectedDocument(item);
                                    setShowSignPopup({ show: true, message: "Document signature is still pending. Do you want to continue signing the document?", primaryButtonText:"Yes, Continue", secondaryButtonText: "No, Cancel Request", showSignBtn: true, heading: "Action required", isPending: true});
                                  }
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
                        }
                      </div>
                      <div
                        className={`w-[calc(100%-52px)] border-b my-3 float-end border-[#E6E8EA] ${
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
        <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
        onClick={handleOutsideClick}
      >
        <div ref={modalRef} className="bg-white rounded-lg p-6 w-[80%] max-w-md">
          <h3 className="flex text-center justify-center text-lg font-bold mb-1">
            {showSignPopup.heading}
          </h3>
          <h3 className="flex text-center justify-center text-sm text-gray font-medium mb-3">
            {showSignPopup.message}
          </h3>
          <div className="flex justify-center gap-4 mt-6">
            {showSignPopup.showSignBtn && (
              <button
                onClick={() => handleSignDocument(showSignPopup.isPending, showSignPopup.primaryButtonText)}
                className="px-4 py-2 bg-[#1D56EE] text-white rounded-lg transition duration-200 hover:bg-[#1540B2] active:bg-[#12369B]"
              >
                {showSignPopup.primaryButtonText}
              </button>
            )}
            <button
              onClick={() => handleSecondaryButtonClick(showSignPopup.isPending, showSignPopup.heading)}
              className={`px-4 py-2 text-gray-600 border border-gray-300 rounded-lg transition duration-200 ${showSignPopup.isPending && showSignPopup.heading !== "Cancel Request" && "bg-[#D32F2F] border-none text-white"}`}
            >
              {showSignPopup.secondaryButtonText}
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};