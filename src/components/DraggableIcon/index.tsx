import Sign from "@/assets/components/Sign";
import {  useAppDispatch, useAppSelector } from "@/core/redux/store";
import { DraggableStateType } from "@/pages/RequestSignature";
import Draggable, { DraggableEventHandler } from "react-draggable";

const DraggableIcon = ({
  pageNumber,
  setSign,
  draggableState,
  text,
  width
}: {
  pageNumber?: number;
  setSign?: (e: DraggableStateType) => void;
  draggableState?: DraggableStateType;
  text?:string;
  width?:number;
}) => {
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);
  const dispatch = useAppDispatch();

  const handleStop: DraggableEventHandler = (_, data) => {
    console.log("Moving " + pageNumber);
    if (!setSign || !pageNumber) return;
    const canvas = document.querySelector(
      `.react-pdf__Page[data-page-number="${pageNumber}"] canvas`
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    console.log("Data: ");
    console.log(data);
    console.log("Canvas rect: ");
    console.log(canvasRect);
    console.log("Surface area: ");
    console.log(safeAreas);

    const topLeftXCoordinate = data.x - 16; // subtract 16 padding, add icon width to react top-right-x-coordinate
    const topLeftYCoordinateFromPageBottomLeftCorner =
      canvasRect.bottom - data.y - 76 - (safeAreas?.top ?? 0);
    dispatch.screen.setSafeAreas({
      canvasRectHeight: canvasRect.height,
      canvasRectWidth: canvasRect.width,
    });

    setSign({
      topLeftXCoordinate,
      topLeftYCoordinateFromPageBottomLeftCorner,
      pageNumber,
    });
  };

  return (
    <Draggable
      axis="both"
      handle=".handle"
      defaultPosition={{ x: 16, y: 0 }}
      position={
        draggableState
          ? {
              x: draggableState.topLeftXCoordinate + 16,
              y: -draggableState.topLeftYCoordinateFromPageBottomLeftCorner,
            }
          : undefined
      }
      // grid={[25, 25]}
      scale={1}
      onStop={handleStop}
      disabled={!!draggableState}
      defaultClassName="draggable"
      bounds={{
        top: 0,
        bottom: window.screen.availHeight - 188 - 114,
        right: window.screen.availWidth - 98 - 16, // add 16 padding from right
        left: 16, // add 16 padding from left
      }}
    >
      <div className="handle" style={{ touchAction: "none" }}>
        <Sign text={text} width={width}/>
      </div>
    </Draggable>
  );
};

export default DraggableIcon;
