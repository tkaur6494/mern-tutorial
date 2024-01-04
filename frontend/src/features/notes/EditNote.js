import { useLocation } from "react-router-dom";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useContext } from "react";
import { getUserList } from "../users/usersApi";
import ErrorBoxWrapper from "../../components/ErrorBox/ErrorBoxWrapper";
import { updateNote } from "./notesApi";
import {RoleContext} from "../../components/RoleContext";

const EditNote = () => {
  const {roles} = useContext(RoleContext)
  const location = useLocation();
  const [title, setTitle] = useState(location.state.noteDetail.title);
  const [text, setText] = useState(location.state.noteDetail.text);
  const [completed, setCompleted] = useState(
    location.state.noteDetail.completed
  );
  const [assignedTo, setAssignedTo] = useState("");
  const [userList, setUserList] = useState([]);
  const [isError, setIsError] = useState({ isError: false, text: "" });

  useEffect(() => {
    getUserList()
      .then((users) => {
        setAssignedTo(
          users.filter((user) => user._id === location.state.noteDetail.user)[0]
        );
        setUserList(users);
      })
      .catch((err) => console.log(err));
  }, [location.state.noteDetail.user]);

  const onChangeAssignedTo = (e) => {
    let selectedUsername = e.target.selectedOptions[0].text;
    let selectedUser = userList.filter((user) => {
      return user.username === selectedUsername;
    })[0];
    setAssignedTo(selectedUser);
  };

  const enableDeleteNote = (roles) => {
    if(roles.includes("Manager")){
      return true
    }
    if(roles.includes("Admin")){
      return true
    }
    return false
  }

  const onSaveForm = () => {
    let requestBody = {
      id: location.state.noteDetail._id,
      title,
      text,
      completed,
      user: assignedTo,
    };
    if (title.trim().length === 0) {
      setIsError({
        isError: true,
        text: "Please enter a title.",
      });
      return;
    }
    if (text.trim().length === 0) {
      setIsError({
        isError: true,
        text: "Please enter a text supporting the title.",
      });
      return;
    }
    updateNote(requestBody)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setIsError({ isError: true, text: response.data.message });
        } else {
          setIsError({ isError: false, text: response.message });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDeleteUser = () => {
    // deleteUser({ id: location.state.userDetail._id })
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       setIsError({ isError: true, text: response.message });
    //     } else {
    //       setIsError({ isError: false, text: response.message });
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const formatDate = (date_string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date_string));
  };

  return (
    <>
      <div className="edituser__title">
        <div>{`Edit Note ${location.state.noteDetail.ticket}`}</div>
        <div>
          <FontAwesomeIcon
            icon={faSave}
            className="icon__pointer icon__padding"
            onClick={onSaveForm}
          ></FontAwesomeIcon>
          {enableDeleteNote(roles) && <FontAwesomeIcon
            icon={faTrash}
            className="icon__pointer icon__padding"
            onClick={onDeleteUser}
          ></FontAwesomeIcon>}
        </div>
      </div>

      <form className="form">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form__input"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          name="text"
          className="form__textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>

        <label htmlFor="completed">Work Complete</label>
        <input
          type="checkbox"
          id="completed"
          name="completed"
          className="form__checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        <label htmlFor="assignedTo">Assigned To</label>
        <select
          id="assignedTo"
          name="assignedTo"
          className="form__select"
          required
          value={assignedTo.username}
          onChange={onChangeAssignedTo}
        >
          {userList.map((user) => {
            return (
              <option key={user._id} value={user.username}>
                {user.username}
              </option>
            );
          })}
        </select>
      </form>
      <div className="editnote__time">
        <p>
          Created: <br />
          {formatDate(location.state.noteDetail.createdAt)}
        </p>
        <p>
          Updated: <br />
          {formatDate(location.state.noteDetail.updatedAt)}
        </p>
      </div>
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

export default EditNote;
