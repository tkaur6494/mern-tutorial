import { useLocation } from "react-router-dom";
import { assignedRoles } from "../../config/assignedRoles";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { updateUser, deleteUser } from "./usersApi";
import ErrorBoxWrapper from "../../components/ErrorBox/ErrorBoxWrapper";

const EditUser = () => {
  const location = useLocation();
  const [username, setUsername] = useState(location.state.userDetail.username);
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(location.state.userDetail.active);
  const [roles, setRoles] = useState(location.state.userDetail.roles);
  const [isError, setIsError] = useState({ isError: false, text: "" });

  const onSaveForm = () => {
    let requestBody = {
      id: location.state.userDetail._id,
      username,
      roles,
      active,
    };
    if (
      username.trim().length === 0 ||
      username.length < 3 ||
      username.length > 20
    ) {
      setIsError({
        isError: true,
        text: "Username should be between 3 and 20 characters.",
      });
      return;
    }
    if (
      password.length !== 0 &&
      (password.length < 4 || password.length > 20)
    ) {
      setIsError({
        isError: true,
        text: "Password should be between 4 and 20 characters.",
      });
      return;
    } else if (password.trim() !== 0) {
      requestBody["password"] = password;
    }
    if (roles.length === 0) {
      setIsError({
        isError: true,
        text: "Please select atleast one role to proceed.",
      });
      return;
    }
    updateUser(requestBody)
      .then((response) => {
        if (response.status !== 200) {
          setIsError({ isError: true, text: response.message });
        } else {
          setIsError({ isError: false, text: response.message });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDeleteUser = () => {
    deleteUser({ id: location.state.userDetail._id })
      .then((response) => {
        if (response.status !== 200) {
          setIsError({ isError: true, text: response.message });
        } else {
          setIsError({ isError: false, text: response.message });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="edituser__title">
        <div>Edit User</div>
        <div>
          <FontAwesomeIcon
            icon={faSave}
            className="icon__pointer icon__padding"
            onClick={onSaveForm}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            icon={faTrash}
            className="icon__pointer icon__padding"
            onClick={onDeleteUser}
          ></FontAwesomeIcon>
        </div>
      </div>

      <form className="form">
        <label htmlFor="username">Username: [3-20 letters]</label>
        <input
          type="text"
          id="username"
          name="username"
          className="form__input"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">
          Password [empty=no change] [4-12 characters]
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form__input"
        />
        <label htmlFor="active">Active</label>
        <input
          type="checkbox"
          id="active"
          name="active"
          className="form__checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <label htmlFor="assignedRoles">Assigned Roles</label>

        <select
          id="assignedRoles"
          name="assignedRoles"
          multiple
          className="form__select"
          required
          value={roles}
          onChange={(e) => {
            const options = [...e.target.selectedOptions];
            const values = options.map((option) => option.value);
            setRoles(values);
          }}
        >
          {Object.values(assignedRoles).map((role) => {
            return (
              <option key={role} value={role}>
                {role}
              </option>
            );
          })}
        </select>
      </form>

      {isError.text !== "" && (
        <ErrorBoxWrapper
          text={isError.text}
          color={isError.isError ? "red" : "green"}
          onClose={() => setIsError({ isError: false, text: "" })}
        />
      )}
    </>
  );
};

export default EditUser;
