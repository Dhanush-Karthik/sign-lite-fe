import { useEffect, useState } from "react";
import BottomBar from "@/components/BottomBar";
import Home from "./components/Home";
import { Documents } from "./components/Documents";
import { AddDocumentModal } from "./components/AddDocumentModal";
import { useDisclosure } from "@/core/hooks/useDisclosure";
import MyPage from "@/components/MyPage";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";

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

const MainPage = () => {
  const { close, isOpen, open } = useDisclosure();
  const email = useAppSelector((state) => state.auth.user?.email);
  const [currentTab, setCurrentTab] = useState<"home" | "documents">("home");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [newDocuments, setNewDocuments] = useState<AssignedDocumentType[]>([]);
  const dispatch = useAppDispatch();

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
    fetchDocuments();
    fetchSignerDocuments();
  }, []);

  return (
    <MyPage name="home">
      {
        {
          home: <Home documents={documents} />,
          documents: <Documents documents={newDocuments} />,
        }[currentTab]
      }
      <BottomBar open={open} setCurrentTab={setCurrentTab} currentTab={currentTab} />
      <AddDocumentModal isOpen={isOpen} close={close} />
    </MyPage>
  );
};

export default MainPage;
