//import packages
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//import components
import Popup from "../../components/Popup/Popup";

//import styles
import "./Dashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]); // shows all users
  const [addUser, setAddUser] = useState(false); // used to toggle the add user popup
  const [viewUser, setViewUser] = useState(false); // used to toggle the view user popup
  const [viewDetails, setViewDetails] = useState(); // stores the user object to be viewed
  const [editUser, setEditUser] = useState(false); // used to toggle edit user popup
  const [editDetails, setEditDetails] = useState(); // stores the user object to be edited
  const [deleteUser, setDeleteUser] = useState(false); // used to toggle the delete user popup
  const [deleteDetails, setDeleteDetails] = useState(); // stores the user object to be deleted
  const [newUserName, setNewUserName] = useState(""); // stores the new user name for add and edit functions
  const [newEmail, setNewEmail] = useState(""); // stores the new email id for add and edit functions
  const [newPassword, setNewPassword] = useState(""); // stores the new Password for add and edit functions
  const [confirmPassword, setConfirmPassword] = useState(""); // stores the confirm password for add and edit functions
  const [id, setId] = useState(null); // to get the id of the user selected for view, edit, delete
  const [error, setError] = useState(); // stores any specialized error sent through API or normal errors
  const navigate = useNavigate(); // to Redirect

  //add new user toggle for popup

  const toggleAddPopup = () => {
    setAddUser(!addUser);
  };

  //add new user to database

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      await Axios.post("http://localhost:3001/adduser", {
        email_id: newEmail,
        password: newPassword,
        user_name: newUserName,
      }).then((response) => {
        if (response.data.error) {
          console.log(response);
          setError(response.data.error);
        }
        if (response.data.message) {
          setError(null);
          toggleAddPopup();
          navigate("/dashboard");
        }
      });
    } else {
      setError("Password and Confirm Password Do Not Match !");
    }
  };

  //toggle view popup

  const toggleViewPopup = () => {
    setViewUser(!viewUser);
  };

  // view button for table

  const handleViewClick = (e, toViewUser) => {
    e.preventDefault();
    setViewDetails(toViewUser);
    setId(toViewUser.id);
    setViewUser(true);
  };

  //edit user toggle for popup

  const toggleEditPopup = () => {
    setEditUser(!editUser);
  };

  // edit button for table

  const handleEditClick = (e, toEditUser) => {
    e.preventDefault();
    setEditDetails(toEditUser);
    setId(toEditUser.id);
    setEditUser(true);
  };

  // edit user in database

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      await Axios.post("http://localhost:3001/edituser", {
        email_id: editDetails.email_id,
        password: newPassword,
        user_name: newUserName,
      }).then((response) => {
        if (response.data.error) {
          console.log(response);
          setError(response.data.error);
        }
        if (response.data.message) {
          setError(null);
          toggleEditPopup();
          navigate("/dashboard");
        }
      });
    } else {
      setError("Password and Confirm Password do not match!");
    }
  };

  // toggle delete confirmation popup

  const toggleDeletePopup = () => {
    setDeleteUser(!deleteUser);
  };

  //Delete button for table

  const handleDeleteClick = (e, toDeleteUser) => {
    e.preventDefault();
    setDeleteDetails(toDeleteUser);
    setId(toDeleteUser.id);
    setDeleteUser(true);
  };

  // Delete user from database

  const handleDeleteUserSubmit = (e, user) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/deleteuser", {
      id: id,
    }).then((response) => {
      if (response.data.error) {
        console.log(response);
        setError(response.data.error);
      } else if (response.data.message) {
        setError(null);
        toggleDeletePopup();
      }
    });
  };

  // useEffect to load the table instantly if any changes made to db
  useEffect(() => {
    Axios.post("http://localhost:3001").then((response) => {
      setUsers(response.data.result);
    });
  });
  return (
    <div>
      <button onClick={toggleAddPopup} className="btn">
        Add User
      </button>

      <table className="styled-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.user_name}</td>
              <td>{user.email_id}</td>
              <td>
                <button
                  className="btn"
                  onClick={(e) => handleViewClick(e, user)}
                >
                  View
                </button>
                <button
                  className="btn"
                  onClick={(e) => handleEditClick(e, user)}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  onClick={(e) => handleDeleteClick(e, user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addUser && (
        <Popup
          content={
            <form className="auth-form" onSubmit={handleAddUserSubmit}>
              <h2>Add a New User</h2>
              <label>
                <span> User Name </span>
                <input
                  required
                  type="text"
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </label>
              <label>
                <span> Email </span>
                <input
                  required
                  type="email"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
              <label>
                <span> Password </span>
                <input
                  required
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label>
                <span> Confirm Password </span>
                <input
                  required
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button className="btn">Add New User</button>
              {error && <div className="error">{error}</div>}
            </form>
          }
          handleClose={toggleAddPopup}
        />
      )}

      {viewUser && (
        <Popup
          content={
            <label>
              <span> User Name : {viewDetails.user_name}</span>
              <span> Email ID: {viewDetails.email_id}</span>
              <button className="btn" onClick={toggleViewPopup}>
                Close
              </button>
            </label>
          }
          handleClose={toggleViewPopup}
        />
      )}

      {editUser && (
        <Popup
          content={
            <form className="auth-form" onSubmit={handleEditUserSubmit}>
              <h2>Edit User</h2>
              <label>
                <span> User Name </span>
                <input
                  required
                  type="text"
                  onChange={(e) =>
                    setNewUserName(
                      e.target.value === ""
                        ? editDetails.user_name
                        : e.target.value
                    )
                  }
                  defaultValue={editDetails.user_name}
                />
              </label>
              <label>
                <span> Email </span>
                <span>{editDetails.email_id}</span>
              </label>
              <label>
                <span> Password </span>
                <input
                  required
                  type="password"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setNewPassword(
                      e.target.value === null
                        ? editDetails.password
                        : e.target.value
                    );
                  }}
                  defaultValue={editDetails.password}
                />
              </label>
              <label>
                <span> Confirm Password </span>
                <input
                  required
                  type="password"
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value === null
                        ? editDetails.password
                        : e.target.value
                    )
                  }
                  defaultValue={editDetails.password}
                />
              </label>

              <button className="btn">Submit Changes</button>
              {error && <div className="error">{error}</div>}
            </form>
          }
          handleClose={toggleEditPopup}
        />
      )}

      {deleteUser && (
        <Popup
          content={
            <form className="auth-form">
              <h2>Delete User</h2>
              <span>
                {" "}
                Are you sure you want to delete this particular user?
              </span>
              <br />
              <span style={{ color: "red" }}>{deleteDetails.email_id}</span>
              <br />
              <br />
              <button className="btn" onClick={handleDeleteUserSubmit}>
                Confirm
              </button>

              {error && <div className="error">{error}</div>}
            </form>
          }
          handleClose={toggleDeletePopup}
        />
      )}
    </div>
  );
}
