type SignProps = { text?: string, width?: number};

const Sign = (props: SignProps) => {
  const width = props.width ?? 100;

  return (
  <svg
    width={width}
    height="24"
    viewBox={`0 0 ${width} 24`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <rect
      x="0"
      y="0"
      width={width}
      height="24"
      rx="4"
      fill="#1D56EE"
    />
    <text
      x="10"
      y="16"
      fill="white"
      font-family="Arial, sans-serif"
      font-size="12"
      font-weight="bold"
    >
      {props.text}
    </text>
    <g transform={`translate(${width - 57}, 0)`}>
      <path
        d="M40 17.3333H48"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M42.9173 6.41467C43.1827 6.14928 43.5426 6.00018 43.9179 6.00018C44.2933 6.00018 44.6532 6.14928 44.9186 6.41467C45.184 6.68007 45.3331 7.04002 45.3331 7.41534C45.3331 7.79066 45.184 8.15061 44.9186 8.41601L36.9119 16.4233C36.7533 16.5819 36.5573 16.698 36.3419 16.7607L34.4273 17.3193C34.3699 17.3361 34.3091 17.3371 34.2512 17.3222C34.1933 17.3074 34.1405 17.2773 34.0982 17.235C34.056 17.1928 34.0259 17.14 34.011 17.0821C33.9962 17.0242 33.9972 16.9634 34.0139 16.906L34.5726 14.9913C34.6354 14.7762 34.7514 14.5804 34.9099 14.422L42.9173 6.41467Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    </svg>
)};
export default Sign;
