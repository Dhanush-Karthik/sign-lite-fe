import { ReactNode, useEffect } from "react";
import { Page } from "framework7-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import { SafeAreas } from "@/types";

const MyPage = ({
  children,
  name,
  className,
}: {
  children: ReactNode;
  name: string;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const safeAreas = useAppSelector((state) => state.screen.safeAreas);

  useEffect(() => {
    if (safeAreas) return;

    const div: HTMLElement | null = document.getElementById("safe-areas");

    if (!div) return;
    const divRect = div.getBoundingClientRect();
    const calculatedSafeAreas: SafeAreas = {
      top: divRect.top,
      bottom: window.screen.height - divRect.height - divRect.top,
      left: divRect.left,
      right: window.screen.width - divRect.width - divRect.left,
      canvasRectHeight: 0,
      canvasRectWidth: 0,
    };
    dispatch.screen.setSafeAreas(calculatedSafeAreas);
  }, [safeAreas, dispatch.screen]);

  return (
    <Page name={name} className={clsx("h-screen bg-main page-container", className)}>
      <div className="absolute -z-50 h-full w-full" id="safe-areas" />
      <div className="h-full">{children}</div>
    </Page>
  );
};

export default MyPage;
