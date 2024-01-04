import { Link } from "react-router-dom";
import { authLogout } from "../features/auth/authApi"
import { useNavigate } from "react-router-dom";

const DashHeader = () => {
  const navigate = useNavigate()
  const logout = () => {
    authLogout()
      .then((resp) => {
        if(resp.status === 200){
          navigate("/logout")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <header className="dash-header">
      <div className="dash-header__container">
        <Link to="/dash">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          <button onClick={logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default DashHeader;
