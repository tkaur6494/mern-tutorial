import { useEffect, useState } from "react";
import ErrorBox from "./ErrorBox";
const ErrorBoxWrapper = ({
  position = "top-right",
  text = "Error",
  color = "red",
  duration = 3000,
}) => {
  const [errorBoxVisible, setErrorBoxVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setErrorBoxVisible(false), duration);
    return () => {
      clearTimeout(timeout);
    };
  });
  return errorBoxVisible ? <ErrorBox position={position} text={text} color={color} /> : null;
};

export default ErrorBoxWrapper;
