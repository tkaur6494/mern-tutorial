const ErrorBox = ({
  position = "top-right",
  text = "Error",
  color = "red",
}) => {
  let positionClass =
    position === "bottom-right"
      ? "error_box_bottom_right"
      : position === "bottom-left"
      ? "error_box_bottom_left"
      : position === "top-left"
      ? "error_box_top_left"
      : "error_box_top_right";

  return (
    <div
      className={`error_box ${positionClass}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
};

export default ErrorBox;
