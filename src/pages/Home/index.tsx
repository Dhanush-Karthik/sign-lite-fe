import { useEffect, useState } from "react";
import BottomBar from "@/components/BottomBar";
import Home from "./components/Home";
import { Documents } from "./components/Documents";
import { AddDocumentModal } from "./components/AddDocumentModal";
import { useDisclosure } from "@/core/hooks/useDisclosure";
import MyPage from "@/components/MyPage";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import HamBurgerIcon from "@/assets/hamburger.svg";
import IDCardIcon from "@/assets/idCard.svg";
import DownArrow from "@/assets/downArrow.svg";
import ProfileIcon from "@/assets/profile.svg";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from "lucide-react";
import Spinner from "@/components/Spinner";

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

interface AssignedDocumentType {
  id: string;
  signer_id: string;
  process_instance_id: string;
  requester: string;
  file_name: string;
  task_id: string;
  status: "INITIATED" | "PENDING" | "COMPLETED" | "FAILED" | "DRAFT";
}

interface UserInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isIdentVerified: boolean;
  email: string;
}

const MainPage = () => {
  const { close, isOpen, open } = useDisclosure();
  const email = useAppSelector((state) => state.auth.user?.email);
  const [currentTab, setCurrentTab] = useState<"home" | "documents">("home");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [newDocuments, setNewDocuments] = useState<AssignedDocumentType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const dispatch = useAppDispatch();
  const [showProfile, setShowProfile] = useState(false);
  const [isNectOpen, setIsNectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleNect = () => {
    setIsNectOpen(!isNectOpen);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleRevokeNect = async() => {
    setIsLoading(true);
    email && await dispatch.doc.revokeNectValidation({ email });
    setUserInfo((prev) => {
      if (!prev) return prev; 
  
      return {
        ...prev,
        isIdentVerified: false,
      };
    });
    setIsLoading(false);
    setShowProfile(false);
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!email) return;
      const docs = await dispatch.doc.getAllDocs({ email });
      setDocuments(docs);
    };
    const fetchSignerDocuments = async () => {
      if (!email) return;
      const docs = await dispatch.doc.getAllSignerDocs({ email });
      setNewDocuments(docs);
    };
    const getUserInfo = async () => {
      if (!email) return;
      const userInformation = await dispatch.doc.getUserDetails({ email });
      setUserInfo(userInformation);
    };
    fetchDocuments();
    fetchSignerDocuments();
    getUserInfo();
  }, []);

  return (
    <>
      {isLoading && 
        <div className="">
          <Spinner isFull={false} />
        </div>
      }
      <MyPage name="home">
        <div className="flex pl-4 items-center gap-3 top-0 w-full z-10 h-20">
          <div className="flex items-center justify-center" onClick={toggleProfile}>
            <img src={HamBurgerIcon} width={"30px"}/>  
          </div>
          <div className="text-xl">{`Hello ${localStorage.getItem("username") ? `, ${localStorage.getItem("username")}` : ""}`}</div>
        </div>
        {
          {
            home: <Home documents={documents} />,
            documents: <Documents documents={newDocuments} />,
          }[currentTab]
        }
        <AnimatePresence>
          {showProfile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={toggleProfile}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-xl z-50"
              >
                <div className="flex items-center justify-between p-4 pb-0">
                  <h2 className="text-xl font-semibold">Profile</h2>
                  <button
                    onClick={toggleProfile}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#F5F6F8] rounded-full flex items-center justify-center">
                        <img src={ProfileIcon} alt="" width={"35px"}/>
                      </div>
                      <div>
                        <div className="font-semibold text-xl">{userInfo?.firstName + " " + userInfo?.lastName}</div>
                        <div className="text-gray text-xs">{userInfo?.email}</div>
                        <div className="text-gray text-xs">{userInfo?.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  <div className="space-y-2">
                    <button
                      onClick={toggleNect}
                      className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={IDCardIcon} alt="" width={"25px"}/>
                        <span className="text-lg">Identification status</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isNectOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img src={DownArrow} alt="" width={"25px"}/>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isNectOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {
                            userInfo?.isIdentVerified ? (
                              <div className="pl-4 p-2 text-green-600 flex justify-between items-center gap-2">Verified by NECT
                                <button onClick={handleRevokeNect} className="py-2 px-3 text-white bg-red-500 hover:bg-red-400 rounded-lg transition-colors border">
                                  Revoke
                                </button>
                              </div>
                            ) : (
                              <div className="pl-12 p-2 text-red-600">Identity not verified</div>
                            )
                          }
                          
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <BottomBar open={open} setCurrentTab={setCurrentTab} currentTab={currentTab} />
        <AddDocumentModal isOpen={isOpen} close={close} />
      </MyPage>
    </>
  );
};

export default MainPage;
