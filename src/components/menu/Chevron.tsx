import "./css/menu.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function PushStateBtn() {
  const colors = useSelector((state: RootState) => state.theme.colors);

  // const backHistory = () => {
  //   history.back();
  // };
  // const nextHistry = () => {
  //   history.forward();
  // };


  return (
    <>
      <div className="flex gap-5">
        <div className={`${colors.grayOpacity} rounded-full  p-1`}>
          <svg className={`w-9 h-9 cursor-pointer hover:${colors.primary} `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 8-4 4 4 4" />
          </svg>

        </div>

        <div className={`${colors.grayOpacity} rounded-full  p-1`}>

          <svg className={`w-9 h-9 cursor-pointer hover:${colors.primary}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 16 4-4-4-4" />
          </svg>
        </div>
      </div>
    </>
  );
}
