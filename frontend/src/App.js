import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList"
import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser";
import NewUser from "./features/users/NewUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        {/*Begin /dash layout ToDO: Protect these routes */}
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList/>}/>
          </Route>
          <Route path="users">
            <Route index element={<UsersList/>}/>
            <Route path=":id" element={<EditUser/>}/>
            <Route path="new" element={<NewUser/>}/>
          </Route>
        </Route>
        {/*End /dash */}
      </Route>
    </Routes>
  );
}

export default App;
