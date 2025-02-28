import MyPage from "@/components/MyPage";
import { Router } from "framework7/types";
import Header from "@/components/Header";

import Button from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import clsx from "clsx";
// import IcAlert from "@/assets/components/IcAlert";
import { useDisclosure } from "@/core/hooks/useDisclosure";
import { useEffect, useState } from "react";
import axios from "axios";
import AddNomineeFieldsRecipientReviewStep from "@/components/AddNomineeFieldsRecipientReviewStep";
import { API_BASE_URL } from "@/constants";
import Spinner from "@/components/Spinner";

const AddNomineeReview = ({ f7router }: { f7router: Router.Router }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const screen = useAppSelector((state) => state.screen);
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  // const isContactActive = useAppSelector((state) => state.contact.isActive);
  const loading = useAppSelector((state) => state.loading.models.doc);
  const docState = useAppSelector((state) => state.doc);
  const multiDocState = useAppSelector((state) => state.multidoc);
  const [isLoading, setIsLoading] = useState(false);
  const { close, open, isOpen } = useDisclosure(); // for listen whether textareas are focused
  const [textAreasValue, setTextAreasValue] = useState({
    emailSubject:
      docState?.emailSubject || `Sign ${multiDocState?.signatureFile?.name} with Secure chat`,
    messageToRecipient: docState?.messageText || "Please sign the document",
  });

  useEffect(() => {
    dispatch.doc.setDoc({
      emailSubject: textAreasValue.emailSubject,
      messageText: textAreasValue.messageToRecipient,
    });
  }, [textAreasValue.emailSubject, textAreasValue.messageToRecipient]);

  const sendDoc = async () => {
    const { ...multidocPayload} = multiDocState;

    multidocPayload.sender = multidocPayload.signers[0].name;
    
    // Define the output signer type
    interface OutputSigner {
      topRightXCoordinate: number;
      topRightYCoordinate: number;
    }
    
    // Define the output object type
    interface Output {
      username: string;
      signatureType: string;
      signers: OutputSigner[];
    }
    
    // Initialize the base output object
    const reqBody: Output = {
      username: user?.name!,
      signatureType: multiDocState?.signatureType!,
      signers: [],
    };
    
  
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
  };

  return (
    <MyPage name="Review">
      {isLoading && 
        <div className="">
          <Spinner isFull={false} />
        </div>
      }
      <Header
        title="Request Signature"
        back={() => {
          f7router.back("/addNomineeRequestSignature", { force: true });
          dispatch.doc.setDoc(null);
          dispatch.contact.setContactActivity(null);
        }}
      />
      <AddNomineeFieldsRecipientReviewStep step="review" />
      <section
        className={clsx(
          "bg-white rounded-t-[20px] pt-6 flex flex-col",
          isOpen && "overflow-scroll"
        )}
        style={{
          height: `calc(100vh - 148px - ${safeAreas?.top ?? 0}px)`,
        }}
      >
        <h2 className="text-primaryTextColor text-xl font-bold px-4">Review</h2>
        <div className={clsx("py-6 px-4 flex-1 flex flex-col gap-6", !isOpen && "overflow-scroll")}>
          <div>
            <h4 className="text-primaryTextColor text-sm leading-[18px] font-medium">Sender</h4>
            <h4 className="text-mainDarkBlue text-sm font-medium mt-4">{docState?.sender}</h4>
            <p className="mt-1 text-gray text-xs">Send via Sign and List</p>
          </div>
          <div>
            <h4 className="text-primaryTextColor text-sm leading-[18px] font-medium">Recipients</h4>
            <div className="flex gap-3 mt-4">
              <div className="w-[44px] h-[44px] rounded-xl bg-textGrey flex justify-center items-center">
                <span className="text-2xl leading-6 font-bold text-backButton">
                  {(docState?.name ?? "").charAt(0).toLocaleUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="text-mainDarkBlue text-sm font-medium">{docState!.name}</h4>
                <div className="flex items-center gap-1">
                  <p className="mt-1 text-gray text-xs">{docState?.email}</p>
                  {/* {!isContactActive && <IcAlert />} */}
                </div>
              </div>
            </div>
            {/* {!isContactActive && (
              <p className="py-1 px-2 rounded-[4px] bg-inactiveContact text-mainDarkBlue text-xs mt-2">
                It looks like this contact hasn’t opened the Miniapp yet. We’ll send them a link to
                get started!
              </p>
            )} */}
          </div>
          <div>
            <h4 className="text-primaryTextColor text-sm leading-[18px] font-medium">
              Email Subject
            </h4>
            <textarea
              name="email-subject"
              id="email-subject"
              placeholder="Enter Email Subject"
              className={clsx(
                "py-[14px] px-[18px] w-full resize-none mt-4 text-primaryTextColor text-sm",
                "rounded-xl border border-lineGrey"
              )}
              value={textAreasValue.emailSubject}
              onChange={(e) =>
                setTextAreasValue({ ...textAreasValue, emailSubject: e.target.value })
              }
              rows={3}
              onFocus={open}
              onBlur={close}
              disabled
            />
          </div>
          <div>
            <h4 className="text-primaryTextColor text-sm leading-[18px] font-medium">Message</h4>
            <textarea
              name="message-to-recipient"
              placeholder="Add message to your recipients..."
              className={clsx(
                "py-[14px] px-[18px] w-full resize-none mt-4 text-primaryTextColor text-sm",
                "rounded-xl border border-lineGrey"
              )}
              value={textAreasValue.messageToRecipient}
              onChange={(e) =>
                setTextAreasValue({ ...textAreasValue, messageToRecipient: e.target.value })
              }
              onFocus={open}
              onBlur={close}
              rows={4}
            />
          </div>
        </div>
        <div
          className={clsx(
            "w-full pt-[6px] pb-[42px] bg-main px-4 flex gap-4 border-t-2 border-buttonContainer"
          )}
        >
          <Button
            text="Previous"
            type="previous"
            disabled={loading}
            onClick={() => {
              f7router.back();
              dispatch.contact.setContactActivity(null);
            }}
          />
          <Button
            text="Send"
            disabled={loading || !!Object.values(textAreasValue).filter((val) => val === "").length}
            isLoading={loading}
            onClick={sendDoc}
          />
        </div>
      </section>
    </MyPage>
  );
};

export default AddNomineeReview;
