import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Alert, Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import firebase from "firebase";
import TodoListItem from "./Todo";

export default function Admin() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();
  const inputTextField = useRef();

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const inputTextFieldA = useRef();
  const inputTextFieldB = useRef();
  const inputTextFieldC = useRef();
  const inputTextFieldD = useRef();
  const inputTextFieldCorrect = useRef();

  useEffect(() => {
    getTodos();
  }, []);

  function getTodos() {
    db.collection("todos").onSnapshot(function (querySnapshot) {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          notCompleted: doc.data().notCompleted,
          toEdit: doc.data().toEdit,
          options: doc.data().options,
          correctAnswer: doc.data().correctAnswer,
        }))
      );
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(todoInput);
    debugger;
    db.collection("todos").add({
      notCompleted: true,
      toEdit: true,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      todo: todoInput,
      options: { A: optionA, B: optionB, C: optionC, D: optionD },
      correctAnswer: correctAnswer,
    });
    setTodoInput("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
  }

  function showStudents() {
    setError("");
    try {
      history.push("/student-Attend");
    } catch {
      setError("Failed to list of students");
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
      <div></div>
      <br />
      <br />
      <div className="row">
        <div className="block col-1 w-100" style={{ minWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong>
              {currentUser && currentUser.email ? currentUser.email : null}

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
          <br />
          <br />
          <div className="text-center mb-4">
            <Button className="btn btn-danger" onClick={showStudents}>
              Show Total Students
            </Button>
          </div>
          <br />
          <br />
        </div>

        <div className="block col-2" style={{ minWidth: "700px" }}>
          <h2 className="text-center mb-4">For assignment Purpose</h2>
          <Form>
            <Form.Group id="to-do">
              <Form.Label>Enter your questions here.</Form.Label>
              <Form.Control
                type="text"
                value={todoInput}
                ref={inputTextField}
                onChange={(e) => {
                  setTodoInput(e.target.value);
                }}
                required
              />
              <label>Enter your 4 different Options </label>
              <div className="row">
                <input
                  class="form-control"
                  style={{ maxWidth: "150px" }}
                  type="text"
                  ref={inputTextFieldA}
                  value={optionA}
                  onChange={(e) => {
                    setOptionA(e.target.value);
                  }}
                  placeholder="Option-A"
                  required
                />
                <input
                  class="form-control"
                  style={{ maxWidth: "150px" }}
                  type="text"
                  ref={inputTextFieldB}
                  value={optionB}
                  onChange={(e) => {
                    setOptionB(e.target.value);
                  }}
                  placeholder="Option-B"
                  required
                />
                <input
                  class="form-control"
                  style={{ maxWidth: "150px" }}
                  type="text"
                  ref={inputTextFieldC}
                  value={optionC}
                  onChange={(e) => {
                    setOptionC(e.target.value);
                  }}
                  placeholder="Option-C"
                  required
                />
                <input
                  class="form-control"
                  style={{ maxWidth: "150px" }}
                  type="text"
                  ref={inputTextFieldD}
                  value={optionD}
                  onChange={(e) => {
                    setOptionD(e.target.value);
                  }}
                  placeholder="Option-D"
                  required
                />
                <br />
                <br />
                <input
                  class="form-control"
                  style={{ maxWidth: "250px" }}
                  type="text"
                  ref={inputTextFieldCorrect}
                  value={correctAnswer}
                  onChange={(e) => {
                    setCorrectAnswer(e.target.value);
                  }}
                  placeholder="Enter Your Correct Answer"
                  required
                />
              </div>

              <br />
              <Button
                className="w-100"
                style={{ maxWidth: "100px" }}
                onClick={handleSubmit}
              >
                To Add
              </Button>
            </Form.Group>
          </Form>
          <br />
          <Table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th width="40%">Title [Total Assignment={todos.length}]</th>
                <th width="30%">Correct Answer</th>
                <th>Operations</th>
              </tr>
            </thead>
          </Table>

          <div>
            {todos.map((todo, i) => (
              <TodoListItem
                todo={todo.todo}
                notCompleted={todo.notCompleted}
                id={todo.id}
                toEdit={todo.toEdit}
                correctAnswer={todo.correctAnswer}
                options={todo.options}
                setTodoInput={setTodoInput}
                todoInput={todoInput}
                optionA={optionA}
                optionB={optionB}
                optionC={optionC}
                optionD={optionD}
                correctAnswers={correctAnswer}
                index={i}
                inputTextField={inputTextField}
                inputTextFieldA={inputTextFieldA}
                inputTextFieldB={inputTextFieldB}
                inputTextFieldC={inputTextFieldC}
                inputTextFieldD={inputTextFieldD}
                inputTextFieldCorrect={inputTextFieldCorrect}
                setOptionA={setOptionA}
                setOptionB={setOptionB}
                setOptionC={setOptionC}
                setOptionD={setOptionD}
                setCorrectAnswer={setCorrectAnswer}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
