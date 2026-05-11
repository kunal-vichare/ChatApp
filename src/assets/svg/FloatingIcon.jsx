import * as React from "react";
import Svg, { G, Path, Line, Defs, ClipPath, Rect } from "react-native-svg";
const FloatingIcon = (props) => (
  <Svg
    width={26}
    height={21}
    viewBox="0 0 26 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_74_17827)">
      <Path
        d="M4.33333 1.75875C3.14166 1.75875 2.16666 2.5375 2.16666 3.5L2.16666 17.5C2.16666 18.4625 3.14166 19.25 4.33333 19.25H17.3333C18.525 19.25 19.5 18.4625 19.5 17.5V5.25L23.8333 1.75L4.33333 1.75875Z"
        fill="#FBFAFF"
      />
      <Path
        d="M27.2388 2.33807L19.613 9.88602L16.6257 1.82846L27.2388 2.33807Z"
        fill="#FBFAFF"
      />
      <Line
        x1={5.26498}
        y1={9.19727}
        x2={16.0983}
        y2={9.19727}
        stroke="#2D7A69"
        strokeWidth={1.5}
      />
      <Line
        x1={5.26498}
        y1={13.6187}
        x2={13.9317}
        y2={13.6187}
        stroke="#2D7A69"
        strokeWidth={1.5}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_74_17827">
        <Rect
          width={21}
          height={26}
          fill="white"
          transform="matrix(0 -1 1 0 0 21)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default FloatingIcon;
