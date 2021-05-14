import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import firebase from "firebase";
// import TodoListItemStudent from "./ToDoS";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [students, setStudents] = useState([]);

  const [correctAnswerSt, setCorrectAnswerSt] = useState([]);

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    getTodos();
  }, []);
  useEffect(() => {
    getStudents();
  }, [getTodos]);

  function getTodos() {
    db.collection("todos").onSnapshot(function (querySnapshot) {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          notCompleted: doc.data().notCompleted,
          correctAnswer: doc.data().correctAnswer,
        }))
      );
    });
  }

  function getStudents() {
    db.collection("students").onSnapshot(function (querySnapshot) {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userName: doc.data().userName,
          attend: doc.data().attend,
          emailId: doc.data().emailId,
        }))
      );
    });
  }

  function toStart() {
    for (var a = 0; a < todos.length; a++) {
      correctAnswerSt.push(todos[a].correctAnswer);
    }
    // var c = students[1].id;
    // db.collection("students").doc(c).update({ attend: true });
    for (var a = 0; a < todos.length; a++) {
      var b = todos[a].id;
      db.collection("todos").doc(b).update({ selectedAns: "" });
    }
    setError("");
    debugger;
    var c = students.find((st) => {
      if (st.emailId === currentUser.email) {
        return st.id;
      }
    });
    db.collection("students").doc(c.id).update({
      attend: true,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      correctAnswerS: correctAnswerSt,
    });

    try {
      history.push("/not-admin");
    } catch {
      setError("Failed to Start your Test");
    }
  }

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <div className="row  align-items-center">
        <div className="block col-1 w-100" style={{ minWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong>
              {currentUser.email}

              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
              <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div
          className="block col-2  align-items-center"
          style={{ minWidth: "700px" }}
        >
          <br />
          <br />
          <h1>
            Hey{" "}
            <u className="text-info">
              {currentUser.email}
              {/* {students[1] && students[1].userName
                ? students[1].userName
                : undefined} */}
            </u>
          </h1>
          <br />
          <h4> Here is your new test!!!</h4>
          <h4>Total no. of Questions are : {todos.length}</h4>
          <h4>Total Marks : {2 * todos.length}</h4>
          <h4>Total time : 1 min</h4>
          <h4>To Start your test click on the Start button.</h4>
          <br />
          <br />
          <Button
            type="button"
            className="btn btn-success btn-lg"
            style={{ minWidth: "200px" }}
            onClick={toStart}
          >
            Start
          </Button>
          {/* <Table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th width="30%">Title</th>
                <th>Work Status</th>
                <th> Mark</th>
              </tr>
            </thead>
          </Table>
          <div className="w-300" style={{ maxWidth: "700px" }}>
            {todos.map((todo, i) => (
              <TodoListItemStudent
                todo={todo.todo}
                notCompleted={todo.notCompleted}
                id={todo.id}
                index={i}
              />
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
}
