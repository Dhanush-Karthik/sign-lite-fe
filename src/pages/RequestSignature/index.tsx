/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/Button";
import DraggableIcon from "@/components/DraggableIcon";
import Header from "@/components/Header";
import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
// import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useEffect, useRef, useState } from "react";
import { Document, pdfjs, Page as PdfPage } from "react-pdf";
import EditBox from "./components/EditBox";
import { Modal } from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export type DraggableStateType =
  | {
      topLeftXCoordinate: number;
      topLeftYCoordinateFromPageBottomLeftCorner: number;
      pageNumber: number;
    }
  | undefined;

const RequestSignature = ({ f7router }: { f7router: Router.Router }) => {
  const [pageCounts, setPageCounts] = useState();
  const docState = useAppSelector((state) => state.doc);
  const dispatch = useAppDispatch();
  const coordinates: DraggableStateType =
    docState?.pageNumber && docState.bottomLeftXCoordinate && docState.bottomLeftYCoordinate
      ? {
          pageNumber: docState.pageNumber,
          topLeftXCoordinate: docState.bottomLeftXCoordinate,
          topLeftYCoordinateFromPageBottomLeftCorner: docState.bottomLeftYCoordinate + 24,
        }
      : undefined;
  const [draggableState, setDraggableState] = useState<DraggableStateType>();
  const [visiblePage, setVisiblePage] = useState<number>();
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState<"signStep" | "checkStep">("signStep");
  const [showSignIcon, setShowSignIcon] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);

  const onDocumentLoadSuccess = (pdf: any) => setPageCounts(pdf._pdfInfo.numPages);

  useEffect(() => {
    if (coordinates) {
      setStep("checkStep");
      setDraggableState(coordinates);
      setShowSignIcon(true);
    }
  }, [f7router.currentRoute.path]);

  // Use IntersectionObserver to detect when a page enters or leaves the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = Number(entry.target.getAttribute("data-page-number"));
            setVisiblePage(pageNumber); // Set the page number that is visible
            setDraggableState(undefined);
          }
        });
      },
      { root: null, threshold: 1 } // Adjust threshold for when to consider the page "visible"
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // Clean up the observer when the component unmounts
      pageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [pageCounts]);

  return (
    <MyPage name="Request Signature">
      <Header
        title="Request Signature"
        back={() => {
          f7router.back("/", { force: true });
          dispatch.doc.setDoc(null);
          dispatch.contact.setContactActivity(null);
        }}
      />
      <div
        className="flex flex-col gap-4 z-0 mx-4 my-5"
        style={{ height: `calc(100vh - 160px - 34px - ${safeAreas?.top ?? 0}px)` }}
      >
        <div className="flex-1 overflow-y-auto">
          <Document
            file={docState?.signatureFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Loading PDF..."
            key={step}
          >
            <>
              {step === "signStep" && showSignIcon && (
                <DraggableIcon pageNumber={visiblePage} setSign={(e) => setDraggableState(e)} />
              )}
              {pageCounts &&
                Array.from({ length: pageCounts }, (_, i) => i + 1).map((num) => (
                  <div
                    key={num}
                    data-page-number={num}
                    ref={(el) => (pageRefs.current[num] = el)}
                    className="relative mb-2"
                  >
                    <PdfPage
                      pageNumber={num}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      loading={num === 1 ? "Loading Pages..." : ""}
                    />
                    {step === "checkStep" && num === draggableState?.pageNumber && (
                      <DraggableIcon draggableState={draggableState} />
                    )}
                  </div>
                ))}
            </>
          </Document>
        </div>
        <EditBox
          step={step}
          showSignIcon={() => setShowSignIcon(!showSignIcon)}
          deleteSign={() => setOpenModal(true)}
          isSignIconActive={showSignIcon}
        />
      </div>
      <div className="w-full pb-[42px] pt-[6px] px-4 flex gap-4 border-t-2 border-buttonContainer">
        <Button
          text="Continue"
          disabled={!draggableState}
          isLoading={false}
          onClick={() => {
            if (step === "signStep") setStep("checkStep");
            else if (step === "checkStep") {
              dispatch.doc.setDoc({
                pageNumber: draggableState?.pageNumber,
                bottomLeftXCoordinate: draggableState?.topLeftXCoordinate,
                bottomLeftYCoordinate:
                  draggableState!.topLeftYCoordinateFromPageBottomLeftCorner - 24,
              });
              f7router.navigate("/recipient");
            }
          }}
        />
      </div>
      {openModal && (
        <Modal onClose={close} title="Are you sure to delete this?">
          <div className="flex gap-4 w-full">
            <Button
              text="Cancel"
              disabled={false}
              isLoading={false}
              onClick={() => {
                setOpenModal(false);
              }}
              type="previous"
            />
            <Button
              text="Delete"
              disabled={false}
              isLoading={false}
              onClick={() => {
                setDraggableState(undefined);
                setStep("signStep");
                setShowSignIcon(false);
                setOpenModal(false);
                setPageCounts(undefined);
                dispatch.doc.setDoc({
                  pageNumber: undefined,
                  bottomLeftXCoordinate: undefined,
                  bottomLeftYCoordinate: undefined,
                });
              }}
            />
          </div>
        </Modal>
      )}
    </MyPage>
  );
};

export default RequestSignature;
