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
import axios from "axios";
import { API_BASE_URL } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import Spinner from "@/components/Spinner";


pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export type DraggableStateType =
  | {
      x : number,
      y : number,
      topLeftXCoordinate: number;
      topLeftYCoordinateFromPageBottomLeftCorner: number;
      pageNumber: number;
    }
  | undefined;


type SignerPositionState = {
  [email: string]: {
    pageNumber: number;
    bottomLeftXCoordinate: number;
    bottomLeftYCoordinate: number;
  };
};

interface OutputSigner {
  topRightXCoordinate: number;
  topRightYCoordinate: number;
}

interface Output {
  signatureType: string;
  signers: OutputSigner[];
}

const AddNomineeRequestSignature = ({ f7router }: { f7router: Router.Router }) => {
  const [pageCounts, setPageCounts] = useState();
  const requesteeDocState = useAppSelector((state) => state.multidoc); // One more left
  const docState = useAppSelector((state) => state.multidoc);
  const dispatch = useAppDispatch();
  const screen = useAppSelector((state) => state.screen);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const [visiblePage, setVisiblePage] = useState<number>();
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState<"signStep" | "checkStep">("signStep");
  const [showSignIcon, setShowSignIcon] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);

  const onDocumentLoadSuccess = (pdf: any) => setPageCounts(pdf._pdfInfo.numPages);

  const [draggableStates, setDraggableStates] = useState<Record<string, DraggableStateType>>({});

  const setDraggableStateForSigner = (signerId: string, newState: DraggableStateType) => {
    setDraggableStates((prevStates) => ({
      ...prevStates,
      [signerId]: newState,
    }));
  };

  const handleContinue = async () => {
    if (step === "signStep") {
      setStep("checkStep");
    } else if (step === "checkStep") {
      // Collect the coordinates for all signers
      const updatedDocState: SignerPositionState | undefined= docState?.signers.reduce(
        (acc, signer) => {
          const signerDraggableState = draggableStates[signer.email];
          if (signerDraggableState) {
            signer.originX =  signerDraggableState.x,
            signer.originY = signerDraggableState.y,
            signer.bottomLeftXCoordinate = signerDraggableState.topLeftXCoordinate;
            signer.bottomLeftYCoordinate = signerDraggableState.topLeftYCoordinateFromPageBottomLeftCorner - 24;
            signer.pageNumber = signerDraggableState.pageNumber;
            acc[signer.email] = {
              pageNumber: signerDraggableState.pageNumber,
              bottomLeftXCoordinate: signerDraggableState.topLeftXCoordinate,
              bottomLeftYCoordinate:
                signerDraggableState.topLeftYCoordinateFromPageBottomLeftCorner - 24,
            };
          }
          return acc;
        },
        {} as SignerPositionState
      );
      
      const reqBody: Output = {
        signatureType: docState?.signatureType!,
        signers: [],
      };

      const { ...multidocPayload} = docState;

      multidocPayload.sender = multidocPayload.signers[0].name;  
    
      multidocPayload.signers.forEach((signer) => {
        signer.bottomLeftXCoordinate = Math.round(
          (100 * signer.bottomLeftXCoordinate! - 16) / (screen.safeAreas!.canvasRectWidth!)
        );

        signer.bottomLeftYCoordinate = Math.round(
          (100 * signer.bottomLeftYCoordinate!) / screen.safeAreas!.canvasRectHeight!
        );

        let topRightXCoordinate = signer.bottomLeftXCoordinate + 20;
        let topRightYCoordinate = signer.bottomLeftYCoordinate + 7;
      
        const newSigner: OutputSigner = {
          ...signer, 
          topRightXCoordinate,
          topRightYCoordinate,
        };
        
        reqBody.signers.push(newSigner);
      });

      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("document", multidocPayload.signatureFile!);
        await axios.post(`${API_BASE_URL}/api/${multidocPayload.sender}/uploadDocument`, 
          formData, 
          {
            headers: {
                "Content-Type": "multipart/form-data",
            },
          }
        );

        await axios.post(`${API_BASE_URL}/api/addNominee`, reqBody, {
          headers: {
            "Authorization": `Bearer ${user?.access_token}`
          }
        })
          .then(() => {
            f7router.navigate("/");
            dispatch.doc.setDoc(null);
            dispatch.contact.setContactActivity(null);
          })
          .catch((error) => {
            if (error.response) {
              console.error('Error Status:', error.response.status);
              console.error('Error Data:', error.response.data);
            } else if (error.request) {
              console.error('No Response Received:', error.request);
            } else {
              console.error('Error Message:', error.message);
            }
          })
      } finally {
        setIsLoading(false);
      }
  
      if (updatedDocState && Object.keys(updatedDocState).length > 0) {
        // dispatch.multidoc.setDoc(updatedDocState);
        f7router.navigate("/addNomineeReview");
      } else {
        console.error("No draggable states found for signers.");
      }
    }
  }

  useEffect(() => {
    if (docState?.signers) {
      const initialStates = docState.signers.reduce((acc, signer) => {
        if (
          draggableStates[signer.email]?.x &&
          draggableStates[signer.email]?.y &&
          signer.pageNumber &&
          signer.bottomLeftXCoordinate &&
          signer.bottomLeftYCoordinate
        ) {
          acc[signer.email] = {
            x: draggableStates[signer.email]?.x!,
            y: draggableStates[signer.email]?.y!,
            pageNumber: signer.pageNumber,
            topLeftXCoordinate: signer.bottomLeftXCoordinate,
            topLeftYCoordinateFromPageBottomLeftCorner: signer.bottomLeftYCoordinate + 24,
          };
        } else {
          acc[signer.email] = undefined;
        }
        return acc;
      }, {} as Record<string, DraggableStateType>);
      setDraggableStates(initialStates);
    }
  }, [docState?.signers]);

  // Use IntersectionObserver to detect when a page enters or leaves the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = Number(entry.target.getAttribute("data-page-number"));
            setVisiblePage(pageNumber); // Set the page number that is visible
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
      {isLoading && 
        <div className="">
          <Spinner isFull={false} />
        </div>
      }
      <Header
        title="Request Signature"
        back={() => {
          f7router.back("/addNominee", { force: true });
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
            file={requesteeDocState?.signatureFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Loading PDF..."
            key={step}
          >
            <>
              {
                step === "signStep" && showSignIcon && docState?.signers.map((signer) => {
                  return <DraggableIcon pageNumber={visiblePage} setSign={(e) => setDraggableStateForSigner(signer.email, e)} text={signer.name}/>
                })
              }
              
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
                    {step === "checkStep" &&
                    docState?.signers.map((signer) => {
                      const signerDraggableState = draggableStates[signer.email];

                      if (num === signerDraggableState?.pageNumber) {
                        return (
                          <DraggableIcon
                            key={signer.email} 
                            draggableState={signerDraggableState}
                            setSign={(e) => setDraggableStateForSigner(signer.email, e)} 
                            text={`${signer.name}`} 
                          />
                        );
                      }

                      return null;
                    })}
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
        disabled={
          !docState?.signers.every(
            (signer) => draggableStates[signer.email] !== undefined
          )
        }
        isLoading={false}
        onClick={handleContinue}
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


export default AddNomineeRequestSignature;
