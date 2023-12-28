import { useState } from "react";
import { assignedRoles } from "../../config/assignedRoles";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUser } from "./usersApi";
import ErrorBoxWrapper from "../../components/ErrorBox/ErrorBoxWrapper";

const NewUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(["Employee"]);
  const [isError, setIsError] = useState({ isError: false, text: "" });

  const onSaveForm = () => {
    let requestBody = {
      username,
      roles,
      password,
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
    if (password.length < 4 || password.length > 20) {
      setIsError({
        isError: true,
        text: "Password should be between 4 and 20 characters.",
      });
      return;
    }
    if (roles.length === 0) {
      setIsError({
        isError: true,
        text: "Please select atleast one role to proceed.",
      });
      return;
    }
    createUser(requestBody)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setIsError({ isError: true, text: response.message });
        } else {
          setIsError({ isError: false, text: response.message });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="newuser__title">
        <div>New User</div>
        <div>
          <FontAwesomeIcon
            icon={faSave}
            className="icon__pointer icon__padding"
            onClick={onSaveForm}
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

export default NewUser;
