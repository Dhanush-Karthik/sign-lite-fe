type SignProps = { text?: string, width?: number};

const Sign = (props: SignProps) => {
  return (
    <div className="flex bg-[#1D56EE] px-[10px] py-[3px] rounded-[5px] text-white">
      <p className="fill-white font-bold text-[13px] font-sans">{props.text}</p>
      <div>
        <svg
          className="h-5 w-8" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.917 2.415a1.375 1.375 0 0 1 1.957 1.958L5.91 11.336a1.375 1.375 0 0 1-.567.341l-1.915.558a.313.313 0 0 1-.384-.384l.558-1.915a1.375 1.375 0 0 1 .34-.567l6.975-6.954Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12h4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
)};
export default Sign;
