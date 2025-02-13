import { Router } from "framework7/types";

const SuccessPopup = ({ f7router }: { f7router: Router.Router }) => {

    const hanldeSuccess = () => {
        f7router.navigate("/");
    }  
    
  return (
    <div className={"fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50"}>
      <div className={"mx-7 flex justify-center items-center"}>
        <div className="flex flex-col justify-center items-center bg-white rounded-[20px] px-3 py-5 gap-2">
            <p className="text-center font-bold">Request sent successfully</p>
            <p className="text-center text-gray text-xs px-2">Signature request is sent successfully to the respective signers</p>
            <button className="bg-[#1C56EE] py-1 px-3 rounded-[5px] text-white mt-2" onClick={hanldeSuccess}>Ok</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
