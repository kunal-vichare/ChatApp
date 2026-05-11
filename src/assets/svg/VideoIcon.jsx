import * as React from "react";
import Svg, { Path } from "react-native-svg";
const VideoIcon = (props) => (
  <Svg
    width={24}
    height={18}
    viewBox="0 0 24 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M15.1757 0H2.15764C0.965972 0 0 1.00313 0 2.24063V15.7594C0 16.9969 0.965972 18 2.15764 18H15.1757C16.3674 18 17.3333 16.9969 17.3333 15.7594V2.24063C17.3333 1.00313 16.3674 0 15.1757 0ZM23.725 1.76719L18.7778 5.31094V12.6891L23.725 16.2281C24.6819 16.9125 26 16.2141 26 15.0187V2.97656C26 1.78594 24.6865 1.08281 23.725 1.76719Z"
      fill="white"
    />
  </Svg>
);
export default VideoIcon;