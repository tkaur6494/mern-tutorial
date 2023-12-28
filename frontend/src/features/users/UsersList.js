import { getUserList } from "./usersApi";
import React, { useState, useEffect } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getUserList()
      .then((users) => setUserList(users))
      .catch((err) => console.log(err));
  }, []);

  const editUserClick = (userDetail) => {
    navigate(`/dash/users/${userDetail._id}`,{state:{"userDetail":userDetail}})
  }

  const newUserClick = () => {
    navigate(`/dash/users/new`)
  }

  return (
    <>
      <h1>Users List</h1>
      <div className="table__container">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Roles</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((user) => {
            return (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.roles.toString().replaceAll(",", ", ")}</td>
                <td><FontAwesomeIcon className="icon__pointer" icon={faEdit} onClick={()=>editUserClick(user)}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <button onClick={newUserClick}>Create new user</button>
    </>
  );
};

export default UsersList;
