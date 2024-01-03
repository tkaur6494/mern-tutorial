import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { RoleContext } from "./RoleContext";

const DashFooter = () => {
  const {username, roles} = useContext(RoleContext)
  const navigate = useNavigate();
  const { pathName } = useLocation();

  const onGoHomeClicked = () => {
    navigate("/dash");
  };

  let goHomeButton = null;
  if (pathName !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const setStatus = (roles) => {
    let status = "Employee"
    if(roles.includes("Manager")){
      status = "Manager"
    }
    if(roles.includes("Admin")){
      status = "Admin"
    }
    return status
  }

  return (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {setStatus(roles)}</p>
    </footer>
  );
};

export default DashFooter;
