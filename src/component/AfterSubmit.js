import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import { Table, Button } from "react-bootstrap";

export default function ForOptions() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [marks, setMarks] = useState(1);
  const [total, setTotal] = useState(1);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getTodos();
    getStudents();
  }, []);
  useEffect(() => {
    calculate();
  }, [getTodos]);

  // useEffect(() => {
  //   getStudents();
  // }, [getTodos]);

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
          selectedAns: doc.data().selectedAns,
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

  function calculate() {
    let x = todos.filter((todoItem) => {
      // console.log(todoItem);
      return todoItem.correctAnswer == todoItem.selectedAns;
    });

    console.log(x);

    console.log(x.length);
    setMarks(2 * x.length);
    setTotal(2 * todos.length);
    console.log("Marks is ");
    console.log(marks);
  }
  function home() {
    var e = students.find((st) => {
      if (st.emailId === currentUser.email) {
        return st.id;
      }
    });

    db.collection("students")
      .doc(e.id)
      .update({ studentMarks: marks, TotalMarks: total });

    try {
      history.push("/");
    } catch {
      setError("Failed to go HOME");
    }
  }

  return (
    <div>
      <h2></h2>
      <h2>
        {" "}
        Your Score : {marks}/{total}
      </h2>
      <Table>
        <thead>
          <tr>
            <th width="10%">Question No.</th>
            <th width="40%">Question</th>
            <th width="25%">Correct Answer</th>
            <th width="25%">Your Answer</th>
          </tr>
        </thead>
      </Table>
      {todos.map((todo, i) => (
        <div>
          <Table>
            <tbody>
              <tr>
                <td width="15%">{i + 1}</td>
                <td width="40%">{todo.todo}</td>
                <td width="25%">{todo.correctAnswer}</td>
                <td width="25%">{todo.selectedAns} </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}
      <div className="w-100 text-center mt-2">
        <Button className="btn btn-success btn-lg " onClick={home}>
          HOME
        </Button>
        {/* <Link to="/">
          <h4 className="text-info">HOME</h4>
        </Link> */}
      </div>
    </div>
  );
}
