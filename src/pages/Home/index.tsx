import { useEffect, useState } from "react";
import BottomBar from "@/components/BottomBar";
import Home from "./components/Home";
import { Documents } from "./components/Documents";
import { AddDocumentModal } from "./components/AddDocumentModal";
import { useDisclosure } from "@/core/hooks/useDisclosure";
import MyPage from "@/components/MyPage";
import { DocType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";

const MainPage = () => {
  const { close, isOpen, open } = useDisclosure();
  const email = useAppSelector((state) => state.auth.user?.email);
  const [currentTab, setCurrentTab] = useState<"home" | "documents">("home");
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [newDocuments, setNewDocuments] = useState<DocType[]>([]);
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
