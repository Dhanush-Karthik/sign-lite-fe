import PendingSVG from "@/assets/StatusLogos/pending.svg";
import DraftSVG from "@/assets/StatusLogos/draft.svg";
import CompletedSVG from "@/assets/StatusLogos/completed.svg";
import MoreIcon from "@/assets/moreIcon.svg";
import { Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/searchIcon.svg";
import DateIcon from "@/assets/dateIcon.svg";
import { Chevron } from "@/assets/components/Chevron";
import CheckIcon from "@/assets/checkIcon.svg";
import { f7, SkeletonBlock } from "framework7-react";
import { DocType } from "@/types";
import { useAppSelector } from "@/core/redux/store";
import { Skeleton } from "@/components/Skeleton";
import NoDocs from "@/assets/components/NoDocs";

interface DocumentsProps {
  documents: DocType[];
}
export const Documents = ({ documents }: DocumentsProps) => {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [selectedStatusOption, setSelectedStatusOption] = useState<
    "All" | "Draft" | "Pending" | "Completed"
  >("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpen, setisOpen] = useState(false);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const loading = useAppSelector((state) => state.loading.models.doc);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setisOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const timeFilterOptions = [
    { text: "All", value: 0 },
    { text: "Last 12 months", value: 1 },
    { text: "Last 6 months", value: 2 },
    { text: "Last 30 days", value: 3 },
    { text: "Last week", value: 4 },
    { text: "Last 24 hours", value: 5 },
  ];

  const filterByDate = (items: DocType[], option: number) => {
    const today = new Date();
    let filterDate: Date;

    switch (option) {
      case 1: // Last 12 months
        filterDate = new Date(today.setFullYear(today.getFullYear() - 1));
        break;
      case 2: // Last 6 months
        filterDate = new Date(today.setMonth(today.getMonth() - 6));
        break;
      case 3: // Last 30 days
        filterDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case 4: // Last week
        filterDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 5: // Last 24 hours
        filterDate = new Date(today.setHours(today.getHours() - 24));
        break;
      default: // All
        return items;
    }

    return items.filter(
      (item) => new Date(item.createdAt ?? item.document.createdAt) >= filterDate
    );
  };
  const StatusMock = [
    {
      count: filterByDate(
        documents.filter((item) =>
          item.document
            ? item.document.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
            : item.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
        ),
        selectedOption
      ).length,
      status: "All",
    },
    {
      count: filterByDate(
        documents.filter((item) => item.status === "DRAFT"),
        selectedOption
      ).length,
      status: "Draft",
    },
    {
      count: filterByDate(
        documents.filter(
          (item) =>
            (item.status === "PENDING" || item.isSigned === false) &&
            (item.document
              ? item.document.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
              : item.file_original_name.toLowerCase().includes(searchValue.toLowerCase()))
        ),
        selectedOption
      ).length,

      status: "Pending",
    },
    {
      count: filterByDate(
        documents.filter(
          (item) =>
            (item.status === "COMPLETED" || item.isSigned) &&
            (item.document
              ? item.document.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
              : item.file_original_name.toLowerCase().includes(searchValue.toLowerCase()))
        ),
        selectedOption
      ).length,
      status: "Completed",
    },
  ];

  const groupByDate = (items: DocType[]) => {
    const grouped: {
      [key: string]: DocType[];
    } = {};

    items.forEach((item) => {
      const date = new Date(item.createdAt ?? item.document.createdAt);
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
  const groupedData = groupByDate(
    filterByDate(
      documents.filter((item) => {
        const matchesStatus =
          selectedStatusOption !== "All"
            ? item.status
              ? item.status ===
                {
                  Draft: "DRAFT",
                  Pending: "PENDING",
                  Completed: "COMPLETED",
                }[selectedStatusOption]
              : selectedStatusOption === "Completed"
              ? item.isSigned
              : selectedStatusOption === "Pending" && !item.isSigned
            : true;

        const matchesSearch = searchValue
          ? item.document
            ? item.document.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
            : item.file_original_name.toLowerCase().includes(searchValue.toLowerCase())
          : true;

        return matchesStatus && matchesSearch;
      }),
      selectedOption
    )
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
                onChange={(e) => handleSearch(e)}
                placeholder="Search document here..."
                className="!bg-white !rounded-[999px] !p-[10px] !pl-10 !w-full !border-none"
              />
            </div>
          )}
        </div>
        <div className="flex gap-[14px] p-4 relative">
          {loading ? (
            <SkeletonBlock
              slot="media"
              tag={"a"}
              width={"188px"}
              height={"34px"}
              effect={"wave"}
              borderRadius={"100px"}
            />
          ) : (
            <div
              onClick={() => setisOpen(true)}
              className="max-w-[188px] w-full rounded-[100px] bg-white border border-defaultBorder py-[6px] px-[14px] flex gap-2 justify-between items-center"
            >
              <img src={DateIcon} />
              <p className="text-mainDarkBlue text-base leading-5 font-medium w-full whitespace-nowrap">
                {timeFilterOptions.find((x) => x.value === selectedOption)?.text}
              </p>
              <div className="w-[18px]">
                <Chevron stroke="#63788E" type="down" />
              </div>
            </div>
          )}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="max-w-[188px] w-full rounded-xl shadow-selectBox py-3 px-4 bg-white z-10 absolute left-4 top-[59px] flex flex-col gap-3"
            >
              {timeFilterOptions.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    setSelectedOption(item.value);
                    setisOpen(false);
                  }}
                  className="flex justify-between"
                >
                  <p
                    className={`text-sm leading-6 text-mainDarkBlue ${
                      item.value === selectedOption && "font-semibold"
                    }`}
                  >
                    {item.text}
                  </p>
                  {item.value === selectedOption && <img src={CheckIcon} />}
                </div>
              ))}
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
                    item.status as SetStateAction<"All" | "Draft" | "Pending" | "Completed">
                  )
                }
                className={`px-[14px] rounded-[100px] py-[6px] flex gap-[6px] items-center ${
                  item.status === selectedStatusOption
                    ? "bg-mainDarkBlue"
                    : "border border-defaultBorder"
                }`}
              >
                <p
                  className={`text-sm  text-mainDarkBlue opacity-60 ${
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
                  <h2 className="text-sm font-medium leading-normal">
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
    </>
  );
};
