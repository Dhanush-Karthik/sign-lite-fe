import { SVGProps } from "react";
const NoDocs = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={152} height={152} fill="none" {...props}>
    <g filter="url(#a)">
      <path
        fill="#fff"
        d="M146 72c0 38.66-31.34 70-70 70S6 110.66 6 72 37.34 2 76 2s70 31.34 70 70Z"
      />
    </g>
    <path
      fill="#E0ECFF"
      stroke="#E0ECFF"
      strokeWidth={3}
      d="M26.408 81.15a1 1 0 0 1 .76-1.65h49.91a2 2 0 0 1 1.52.701l14.086 16.5C93.792 98 92.87 100 91.164 100H43.421a2 2 0 0 1-1.52-.701l-15.494-18.15Z"
    />
    <path
      fill="url(#b)"
      d="M41 54.944a2.414 2.414 0 0 1 2.414-2.414h47.153l2.918-3.166a2.414 2.414 0 0 1 1.775-.778h8.499A2.413 2.413 0 0 1 106.172 51v48.276a2.413 2.413 0 0 1-2.413 2.414H43.414A2.414 2.414 0 0 1 41 99.276V54.944Z"
    />
    <path fill="url(#c)" d="M44.62 56.13h57.932v32.887H44.621V56.13Z" />
    <path
      fill="#B4D1FF"
      d="M45.589 60.389a2.414 2.414 0 0 1 2.399-2.148h60.315a2.413 2.413 0 0 1 2.399 2.68l-4.291 38.621a2.414 2.414 0 0 1-2.399 2.148H43.697a2.414 2.414 0 0 1-2.4-2.68l4.292-38.621Z"
    />
    <circle cx={101} cy={81.5} r={15} fill="#fff" stroke="#337EFC" strokeWidth={3} />
    <path stroke="#337EFC" strokeLinecap="round" strokeWidth={3} d="m111.09 93.707 7.374 9.325" />
    <path
      stroke="#337EFC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M97.5 77.58c0-4.773 7.5-4.773 7.5 0 0 3.409-3.409 2.727-3.409 6.818m.009 4.112.01-.011"
    />
    <defs>
      <linearGradient id="b" x1={74} x2={73.586} y1={31} y2={101.69} gradientUnits="userSpaceOnUse">
        <stop stopColor="#B4D1FF" />
        <stop offset={0.92} stopColor="#337EFC" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={73.586}
        x2={73.586}
        y1={55.526}
        y2={89.017}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset={0.12} stopColor="#F2F2F2" />
      </linearGradient>
      <filter
        id="a"
        width={152}
        height={152}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={3} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.45098 0 0 0 0 0.478431 0 0 0 0 0.631373 0 0 0 0.16 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1007_1148" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1007_1148" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default NoDocs;
