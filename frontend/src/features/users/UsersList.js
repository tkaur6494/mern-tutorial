import { getUserList } from "./usersApi";
import React, { useState, useEffect } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UsersList = () => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    getUserList()
      .then((users) => setUserList(users))
      .catch((err) => console.log(err));
  }, []);
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
          {userList?.map((item) => {
            return (
              <tr key={item._id}>
                <td>{item.username}</td>
                <td>{item.roles.toString().replaceAll(",", ", ")}</td>
                <td><FontAwesomeIcon icon={faEdit}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      
    </>
  );
};

export default UsersList;
