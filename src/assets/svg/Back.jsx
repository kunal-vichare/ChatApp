import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Back = (props) => (
  <Svg
    width={20}
    height={18}
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 7.6087H4.75L11.75 1.52174L10 0L0 8.69565L10 17.3913L11.75 15.8696L4.75 9.78261H20V7.6087Z"
      fill="white"
    />
  </Svg>
);
export default Back;