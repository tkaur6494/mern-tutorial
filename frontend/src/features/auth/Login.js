import {useNavigate} from "react-router-dom"
import { useState } from "react";
import { authLogin } from "./authApi";
import ErrorBoxWrapper from "../../components/ErrorBox/ErrorBoxWrapper";
import {setAuthorization} from "../../api/api"
import { jwtDecode } from "jwt-decode";


const Login = ({setContext}) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState({ isError: false, text: "" });

  const onSaveForm = (e) => {
    e.preventDefault()
    let requestBody = {
      username,
      password,
    };
    if (username.trim().length === 0) {
      setIsError({
        isError: true,
        text: "Please enter a username.",
      });
      return;
    }
    if (password.trim().length === 0) {
      setIsError({
        isError: true,
        text: "Please enter a password.",
      });
      return;
    }
    authLogin(requestBody)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
            setIsError({isError:true, text:response.message})
        } else {
          setAuthorization(response.token)
          setContext(jwtDecode(response.token).UserInfo)
          navigate("/dash")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <header className="dash-header">
        <div className="dash-header__container">
          <h1 className="dash-header__title">Employee Login</h1>
          <nav className="dash-header__nav">{/* add nav buttons later */}</nav>
        </div>
      </header>
      <div className="dash-container">
        <form className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form__input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form__input"
          />
          <button onClick={onSaveForm}>Sign In</button>
        </form>
        {isError.text !== "" && (
        <ErrorBoxWrapper
          text={isError.text}
          color={isError.isError ? "red" : "green"}
          onClose={() => setIsError({ isError: false, text: "" })}
        />
      )}
      </div>
    </>
  );
};

export default Login;
