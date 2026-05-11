import * as React from "react";
import Svg, { Ellipse } from "react-native-svg";
const MenuIcon = (props) => (
  <Svg
    width={5}
    height={27}
    viewBox="0 0 5 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Ellipse
      cx={2.30303}
      cy={23.8536}
      rx={2.9817}
      ry={2.30303}
      transform="rotate(-90 2.30303 23.8536)"
      fill="#DEDDE2"
    />
    <Ellipse
      cx={2.30303}
      cy={13.4175}
      rx={2.9817}
      ry={2.30303}
      transform="rotate(-90 2.30303 13.4175)"
      fill="#E5E5EA"
    />
    <Ellipse
      cx={2.30303}
      cy={2.98176}
      rx={2.9817}
      ry={2.30303}
      transform="rotate(-90 2.30303 2.98176)"
      fill="#E5E5EA"
    />
  </Svg>
);
export default MenuIcon;
