import { DocumentsIcon } from "@/assets/components/DocumentsIcon";
import { f7 } from "framework7-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Photos from "@/assets/photos.svg";
import Camera from "@/assets/camera.svg";
import CrossIcon from "@/assets/crossIcon.svg";
import { useAppDispatch } from "@/core/redux/store";
import jsPDF from "jspdf"; // Library for creating PDFs
import { nonceGenerator } from "@/core/utils";

const RequestSignaturesStep = ({
  close,
  setType,
}: {
  close: () => void;
  setType: Dispatch<SetStateAction<"request" | "sign" | "main">>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedFile) {
      dispatch.multidoc.setDoc({ signatureFile: selectedFile , signers: []});
      f7.views.main.router.navigate("/addNominee");
      close();
    }
  }, [selectedFile]);

  // Convert image to PDF
  const convertImageToPdf = (imageFile: File) => {
    const reader = new FileReader();
    const name = imageFile.name;

    reader.onload = function (e) {
      const imgData = e.target?.result as string;

      // Create a new Image object
      const img = new Image();
      img.src = imgData;

      img.onload = function () {
        // Create a canvas to manipulate the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const width = img.width;
        const height = img.height;

        // Determine whether the image is in landscape mode
        const isLandscape = width > height;

        if (isLandscape) {
          // For landscape mode, fit the image into the landscape page size
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
        } else {
          // For portrait mode, adjust canvas dimensions and draw the image
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
        }

        // Get the corrected image data from the canvas
        const correctedImgData = canvas.toDataURL("image/jpeg");

        // Create a new jsPDF instance
        // Use 'landscape' orientation if the image is in landscape mode
        const orientation = isLandscape ? "landscape" : "portrait";
        const pdf = new jsPDF({ orientation });

        // Add the image to the PDF (fit within page size for both orientations)
        if (isLandscape) {
          pdf.addImage(correctedImgData, "JPEG", 10, 10, 280, 190); // Adjust for landscape size
        } else {
          pdf.addImage(correctedImgData, "JPEG", 10, 10, 190, 280); // Portrait size
        }

        // Save the PDF file
        const pdfBlob = pdf.output("blob");

        // Create a File object for the PDF to use with setSelectedFile
        const pdfFile = new File(
          [pdfBlob],
          name.split(".")[0] === "image" ? `document-${nonceGenerator(7)}.pdf` : name,
          {
            type: "application/pdf",
          }
        );

        setSelectedFile(pdfFile);
      };
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <p className="text-[#d2ddfd] text-sm font-medium">Add documents from</p>
      <div className="flex justify-between gap-6 text-white">
        <div>
          <label htmlFor="pdf-upload" className="flex flex-col gap-3 items-center">
            <div className="bg-[#386aef] flex items-center justify-center mx-[10px] rounded-xl w-11 h-11">
              <DocumentsIcon stroke="#fff" />
            </div>
            <p className="text-sm font-medium">Files</p>
          </label>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files) setSelectedFile(e.target.files[0]);
            }}
            onClick={(e) => {
              const element = e.target as HTMLInputElement;
              element.value = "";
            }}
            className="hidden"
          />
        </div>
        <div>
          <label htmlFor="image-upload" className="flex flex-col gap-3 items-center">
            <div className="bg-[#386aef] flex items-center justify-center mx-[10px] rounded-xl w-11 h-11">
              <img src={Photos} />
            </div>
            <p className="text-sm font-medium">Photos</p>
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const imageFile = e.target.files[0];
                convertImageToPdf(imageFile); // Convert the captured image to PDF
              }
            }}
            className="hidden"
          />
        </div>
        <div>
          <label htmlFor="camera-upload" className="flex flex-col gap-3 items-center">
            <div className="bg-[#386aef] flex items-center justify-center mx-[10px] rounded-xl w-11 h-11">
              <img src={Camera} />
            </div>
            <p className="text-sm font-medium">Camera</p>
          </label>
          <input
            type="file"
            id="camera-upload"
            accept="image/*"
            capture="environment" // Opens the back camera for capturing
            onChange={(e) => {
              if (e.target.files) {
                const imageFile = e.target.files[0];
                convertImageToPdf(imageFile); // Convert the captured image to PDF
              }
            }}
            className="hidden"
          />
        </div>
      </div>
      <div
        onClick={() => {
          setType("main");
          close();
        }}
        className="bg-[#0A3DC7] rounded-full w-14 h-14 flex items-center justify-center -left-4 bottom-0"
      >
        <img src={CrossIcon} />
      </div>
    </div>
  );
};

export default RequestSignaturesStep;
