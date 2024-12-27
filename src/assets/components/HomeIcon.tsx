interface HomeIconProps {
  selected?: boolean;
}
export const HomeIcon = ({ selected = false }: HomeIconProps) => {
  return (
    <>
      {selected ? (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="ic_home">
            <path
              id="Vector"
              d="M3.5 10.4673C3.5 9.54148 3.92742 8.66756 4.65818 8.09919L10.6582 3.43253C11.7415 2.58994 13.2585 2.58994 14.3418 3.43253L20.3418 8.0992C21.0726 8.66756 21.5 9.54148 21.5 10.4673V20C21.5 20.5304 21.2893 21.0391 20.9142 21.4142C20.5391 21.7893 20.0304 22 19.5 22H5.5C4.96957 22 4.46086 21.7893 4.08579 21.4142C3.71071 21.0391 3.5 20.5304 3.5 20V10.4673Z"
              fill="#051A30"
            />
            <path
              id="Vector_2"
              d="M9.5 17H15.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      ) : (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 17H15.5M21.5 20V10.4673C21.5 9.54148 21.0726 8.66756 20.3418 8.0992L14.3418 3.43253C13.2585 2.58994 11.7415 2.58994 10.6582 3.43253L4.65818 8.09919C3.92742 8.66756 3.5 9.54148 3.5 10.4673V20C3.5 20.5304 3.71071 21.0391 4.08579 21.4142C4.46086 21.7893 4.96957 22 5.5 22H19.5C20.0304 22 20.5391 21.7893 20.9142 21.4142C21.2893 21.0391 21.5 20.5304 21.5 20Z"
            stroke="#63788E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};
