/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainDarkBlue: "#051A30",
        primaryTextColor: "#232935",
        gray: "#63788E",
        blue: "#1D56EE",
      },
      backgroundColor: {
        main: "#F5F6F8",
        okButtonEnabled: "#1D56EE",
        okButtonDisabled: "#E1E4EA",
        backButton: "#E7EDF3",
        lineGrey: "#C8CCD5",
        textGrey: "#E4EBFD",
        inactiveContact: "rgba(239, 75, 52, 0.12)"
      },
      textColor: {
        backButton: "#1D56EE",
        deleteColor: "#EF4B34"
      },
      borderColor: {
        buttonContainer: "#E7EDF3",
        defaultBorder: "#051a301a",
        lineGrey: "#C8CCD5",
      },
      boxShadow: {
        modal: "0px 1px 4px 0px rgba(5, 26, 48, 0.04);",
        selectBox: "0px 4px 32px 0px rgba(5, 26, 48, 0.14);",
        signatureRequest: "0px 1px 8px 0px rgba(5, 26, 48, 0.08);"
      },
    },
  },
  plugins: [],
};
