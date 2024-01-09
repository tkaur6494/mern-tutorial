import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUser from "./features/users/NewUser";
import NewNote from "./features/notes/NewNote";
import EditNote from "./features/notes/EditNote";
import Logout from "./features/auth/Logout";
import { RoleContext } from "./components/RoleContext";

function App() {
  const [userData, setUserData] = useState({ username: "", roles: [] });

  const setContext = (userInfo) => {
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUserData(userInfo);
  };

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      setUserData(JSON.parse(sessionStorage.getItem("userInfo")));
    }
  }, []);

  return (
    <RoleContext.Provider value={userData}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route
            path="login"
            element={<Login setContext={(userInfo) => setContext(userInfo)} />}
          />

          {/*Begin /dash layout ToDO: Protect these routes */}
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />
            <Route path="notes">
              <Route index element={<NotesList />} />
              <Route path="new" element={<NewNote />} />
              <Route path=":id" element={<EditNote />} />
            </Route>
            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUser />} />
            </Route>
          </Route>

          <Route path="logout" element={<Logout />} />
          {/*End /dash */}
        </Route>
      </Routes>
    </RoleContext.Provider>
  );
}

export default App;
