import { useState, useEffect } from "react";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorBoxWrapper from "../../components/ErrorBox/ErrorBoxWrapper";
import { getUserList } from "../users/usersApi";
import { createNote } from "./notesApi";


const NewNote = () => {

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [assignedTo, setAssignedTo] = useState({});
  const [userList, setUserList] = useState([]);
  const [isError, setIsError] = useState({ isError: false, text: "" });

  useEffect(() => {
    getUserList()
      .then((users) => {
        setUserList(users)
        setAssignedTo(users[0])
      })
      .catch((err) => console.log(err));
  }, []);

  const onChangeAssignedTo = (e) => {
    let selectedUsername = e.target.selectedOptions[0].text;
    let selectedUser = userList.filter((user) => {
        return user.username === selectedUsername;
      })[0]
    setAssignedTo(selectedUser)
  };

  const onSaveForm = () => {
    let requestBody = {
      title,
      text,
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
    createNote(requestBody)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          setIsError({ isError: true, text: response.message });
        }  else {
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
        <div>New Note</div>
        <div>
          <FontAwesomeIcon
            icon={faSave}
            className="icon__pointer icon__padding"
            onClick={onSaveForm}
          ></FontAwesomeIcon>
        </div>
      </div>

      <form className="form">
        <label htmlFor="username">Title</label>
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

export default NewNote;
