/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/Header";
import MyPage from "@/components/MyPage";
// import { API_BASE_URL, API_PATHS } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import { DocType } from "@/types";
import { Router } from "framework7/types";
import { useEffect, useState } from "react";
import { Document, pdfjs, Page as PdfPage } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export const ViewDoc = ({ f7router, item }: { f7router: Router.Router; item: DocType }) => {
  const [pageCounts, setPageCounts] = useState(1);
  const [pdf, setPdf] = useState<string>();
  const dispatch = useAppDispatch();

  const onDocumentLoadSuccess = (pdf: any) => setPageCounts(pdf._pdfInfo.numPages);

  const getDoc = async () => {
    const response = await dispatch.doc.getOneDoc(
      item.status
        ? item.status === "COMPLETED"
          ? { mediaId: item.signers[0].mediaId! }
          : { fileName: item.file_name }
        : item.isSigned
        ? { mediaId: item.mediaId! }
        : { fileName: item.document.file_name }
    );
    setPdf(response);
  };

  useEffect(() => {
    getDoc();
  }, []);

  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  return (
    <MyPage name="viewdoc">
      <Header title="View Doc" back={() => f7router.back()} />
      <div
        className="flex flex-col gap-4 z-0 mx-4 my-5"
        style={{
          height: `calc(100vh - 96px - 34px - ${safeAreas?.top ?? 0}px)`,
        }}
      >
        <div className="flex-1 overflow-y-auto">
          {!pdf ? (
            <p>Loading PDF...</p>
          ) : (
            <Document file={pdf} loading="Loading PDF..." onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from({ length: pageCounts }, (_, i) => i + 1).map((num) => (
                <PdfPage
                  pageNumber={num}
                  key={num}
                  className="relative mb-2"
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={num === 1 ? "Loading Pages..." : ""}
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </MyPage>
  );
};
