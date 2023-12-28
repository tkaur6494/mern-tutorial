import { useEffect, useState } from "react";
import ErrorBox from "./ErrorBox";
const ErrorBoxWrapper = ({
  position = "top-right",
  text = "Error",
  color = "red",
  duration = 3000,
  onClose = () => {}
}) => {
  const [errorBoxVisible, setErrorBoxVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose()
      setErrorBoxVisible(false);
    }, duration);
    return () => {
      clearTimeout(timeout);
    };
  });
  return errorBoxVisible ? (
    <ErrorBox position={position} text={text} color={color} />
  ) : null;
};

export default ErrorBoxWrapper;
