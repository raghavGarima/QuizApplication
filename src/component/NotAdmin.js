import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Alert, Table } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import firebase from "firebase";
// import TodoListItemStudent from "./NotAdminTodo";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [marks, setMarks] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [answer, setAnswer] = useState([]);
  const [forCheckA, setForCheckA] = useState(false);
  const [forCheckB, setForCheckB] = useState(false);
  const [forCheckC, setForCheckC] = useState(false);
  const [forCheckD, setForCheckD] = useState(false);
  const intervalRef = useRef(null);
  const [ttodos, setTtodos] = useState([]);
  const [eemail, setEemail] = useState([]);
  const [students, setStudents] = useState([]);

  const [timer, setTimer] = useState("00:00:00");
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
          toEdit: doc.data().toEdit,
          options: doc.data().options,
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

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function startTimer(deadline) {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(deadline);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    } else {
      clearInterval(intervalRef.current);
    }

    if (minutes == 0 && seconds == 0) {
      console.log(todos);
      console.log(ttodos);
      debugger;
      if (selected !== "") {
        if (answer.length == 0) {
          answer.push(selected);
        } else {
          var x = answer.find((ans, index) => {
            return index === currentQuestion;
          });
          console.log(x);
          if (x !== null) {
            answer[currentQuestion] = selected;
          } else {
            answer.push(selected);
          }
        }
      }

      for (var a = 0; a < answer.length; a++) {
        var b = ttodos[a];
        db.collection("todos").doc(b).update({ selectedAns: answer[a] });
      }
      debugger;
      var e = eemail.find((em) => {
        if (em.emailId === currentUser.email) {
          return em.id;
        }
      });

      db.collection("students").doc(e.id).update({ selectedAnsSt: answer });

      try {
        history.push("/not-admin-for");
      } catch {
        setError("Failed to show marks");
      }
    }
  }
  function clearTimer(endtime) {
    setTimer("00:01:00");
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(() => {
      startTimer(endtime);
    }, 1000);
    intervalRef.current = id;
  }

  function getDeadlineTime() {
    let deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 1);
    return deadline;
  }

  useEffect(() => {
    clearTimer(getDeadlineTime());
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function toSetNext() {
    if (ttodos.length == 0) {
      for (var i = 0; i < todos.length; i++) {
        ttodos.push(todos[i].id);
      }
    }
    if (eemail.length === 0) {
      for (var j = 0; j < students.length; j++) {
        eemail.push(students[j]);
      }
    }

    console.log("selected value in next");
    console.log(selected);
    // debugger;
    if (selected === todos[currentQuestion].correctAnswer) {
      console.log("set False");
      // db.collection("todos").doc(id).update({
      //     notCompleted: false,
      //   });
    } else {
      console.log("set True");
      // db.collection("todos").doc(id).update({
      //   notCompleted: true,
      // });
    }
    //answer.push((currentQuestion: selected));

    if (answer.length == 0) {
      answer.push(selected);
    } else {
      var x = answer.find((ans, index) => {
        return index === currentQuestion;
      });
      console.log(x);
      if (x !== null) {
        answer[currentQuestion] = selected;
      } else {
        answer.push(selected);
      }
    }

    // setAnswer([]);
    // var x = answer.find((ans) => {
    //   if (ans.currentQuestion == currentQuestion) {
    //     console.log("Found");
    //     answer[currentQuestion] = selected;
    //   } else {
    //     console.log("Noyt Found");
    //   }
    // });
    // answer.push(selected);
    // for (var i = -1; i < answer.length; i++) {
    //   if (i == currentQuestion) {
    //     console.log("Found");
    //   } else {
    //     console.log("not Found")
    //   }
    // }

    console.log(answer);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < todos.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      alert("This is last question");
    }

    var z = currentQuestion;
    console.log(answer);
    if (z < todos.length - 1) {
      if (answer[z + 1] === todos[currentQuestion + 1].options.A) {
        console.log("optionA");
        setForCheckA(true);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(false);
      } else if (answer[z + 1] === todos[currentQuestion + 1].options.B) {
        console.log("optionB");
        setForCheckA(false);
        setForCheckB(true);
        setForCheckC(false);
        setForCheckD(false);
      } else if (answer[z + 1] === todos[currentQuestion + 1].options.C) {
        console.log("optionC");
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(true);
        setForCheckD(false);
      } else if (answer[z + 1] === todos[currentQuestion + 1].options.D) {
        console.log("optionD");
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(true);
      } else {
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(false);
      }
    }

    // setForCheckA(false);
    // setForCheckB(false);
    // setForCheckC(false);
    // setForCheckD(false);
    if (answer.length === todos.length) {
      setSelected(answer[currentQuestion + 1]);
    } else {
      setSelected("");
    }
  }

  function toSetPrevious() {
    const previousQuestion = currentQuestion - 1;
    if (previousQuestion >= 0) {
      setCurrentQuestion(previousQuestion);
    } else {
      alert("This is 1st question");
    }
    var y = currentQuestion;
    console.log(answer);
    if (y > 0) {
      if (answer[y - 1] === todos[currentQuestion - 1].options.A) {
        console.log("optionA");
        setForCheckA(true);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(false);
      } else if (answer[y - 1] === todos[currentQuestion - 1].options.B) {
        console.log("optionB");
        setForCheckA(false);
        setForCheckB(true);
        setForCheckC(false);
        setForCheckD(false);
      } else if (answer[y - 1] === todos[currentQuestion - 1].options.C) {
        console.log("optionC");
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(true);
        setForCheckD(false);
      } else if (answer[y - 1] === todos[currentQuestion - 1].options.D) {
        console.log("optionD");
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(true);
      } else {
        setForCheckA(false);
        setForCheckB(false);
        setForCheckC(false);
        setForCheckD(false);
      }
    }

    // refForA = todos[currentQuestion].options.A;
    // refForB = todos[currentQuestion].options.B;
    // refForC = todos[currentQuestion].options.C;
    // refForD = todos[currentQuestion].options.D;

    console.log(answer[y - 1]);
  }

  function forSelectedOption() {
    if (selected === todos[currentQuestion].correctAnswer) {
      console.log("Very Good");
    } else {
      console.log("Not Corrects");
    }
    console.log(selected);

    // answer.forEach((ans) => {
    //   if (ans.currentQuestion == currentQuestion) {
    //     console.log("Found");
    //     answer[currentQuestion] = selected;
    //   } else {
    //     console.log("Noyt Found");
    //   }
    // });
    // console.log(selected.length);
  }

  function restart() {
    let x = todos.filter((todoItem) => {
      // console.log(todoItem);
      return todoItem.notCompleted !== true;
    });

    console.log(x);
    console.log(todos);

    x.forEach((tod) => {
      db.collection("todos").doc(tod.id).update({ notCompleted: true });
    });
    setMarks(0);
    console.log(todos);
    //debugger;
    // todos.forEach((todo) => {
    //   db.collection("todos").doc(id).update({ notCompleted: true });
    // });
  }

  function calculate() {
    debugger;
    if (selected !== "") {
      if (answer.length == 0) {
        answer.push(selected);
      } else {
        var x = answer.find((ans, index) => {
          return index === currentQuestion;
        });
        console.log(x);
        if (x !== null) {
          answer[currentQuestion] = selected;
        } else {
          answer.push(selected);
        }
      }
    }

    //   db.collection("todos").add({
    //   selected:answer
    // });

    for (var a = 0; a < answer.length; a++) {
      var b = todos[a].id;
      db.collection("todos").doc(b).update({ selectedAns: answer[a] });
    }

    var e = students.find((st) => {
      if (st.emailId === currentUser.email) {
        return st.id;
      }
    });

    db.collection("students").doc(e.id).update({ selectedAnsSt: answer });

    // else {
    //   for (var a = 0; a < answer.length; a++) {
    //     var b = todos[a].id;
    //     db.collection("todos").doc(b).update({ selectedAns: answer[a] });
    //   }
    // }

    // for (var a = 0; a < answer.length; a++) {

    //   if(answer[a]===todos[a].selectedAns){}

    // }

    // var a = todos[0].id;
    // db.collection("todos").doc(a).update({ selectedAns: answer[0] });

    try {
      history.push("/not-admin-for");
    } catch {
      setError("Failed to show marks");
    }
    // let x = todos.filter((todoItem) => {
    //   // console.log(todoItem);
    //   return todoItem.notCompleted !== true;
    // });

    // console.log(x);

    // console.log(x.length);
    // setMarks(2 * x.length);
    // console.log("Marks is ");
    // console.log(marks);
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
      <div className="row">
        <div className=" w-100" style={{ minWidth: "400px" }}>
          {/* <h2 className="text-center mb-4">Profile</h2> */}
          {error && <Alert variant="danger">{error}</Alert>}
          <h3 className="text-center mb-4">
            <strong>User:</strong>
            {currentUser.email}
          </h3>
          <Button
            className="w-100 text-right mt-2"
            variant="link"
            onClick={handleLogout}
          >
            Log Out
          </Button>
          <div className="row">
            <h5 className="w-100 text-left mt-2">Time : {timer}</h5>
          </div>

          <br />
          {/* <Card>
            <Card.Body>
              <div className="text-center mb-4">
                <Button
                  className="btn btn-primary w-100 mt-3 "
                  style={{ maxWidth: "200px" }}
                  onClick={calculate}
                >
                  Submit your Test
                </Button>
                <br />
                <br />
                <h3>Total Marks=10</h3>
                <h3>You get={marks}</h3>

                <Button
                  className="btn btn-primary w-100 mt-3"
                  style={{ maxWidth: "200px" }}
                  onClick={restart}
                >
                  Restart
                </Button>
              </div>
            </Card.Body>
          </Card> */}
        </div>

        <div className="data" style={{ minWidth: "700px" }}>
          <div className="w-300" style={{ maxWidth: "700px" }}>
            {/* <h1>{todos[0].todo}</h1> */}
            {/* <div>
              {todos[0].options.map((option) => (
                {/* <div>{option.A}</div> */}
            {/* ))}
          </div>
          */}
            {/* <h2>{todos[1].todo}</h2>
            <h2>{todos[2].todo}</h2> */}
            {/* {todos[0].options.A} */}
            <div>
              <h4>
                Total No. Questions : {currentQuestion + 1}/{todos.length}
              </h4>
            </div>
            {/* {todos[currentQuestion] && todos[currentQuestion].todo
              ? todos[currentQuestion].todo
              : undefined} */}
            <h1>
              {currentQuestion + 1}.
              {todos[currentQuestion] && todos[currentQuestion].todo
                ? todos[currentQuestion].todo
                : undefined}
              <h6 className="w-100 text-right mt-2">2 Points</h6>
            </h1>

            <input
              type="radio"
              id={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              name={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              value={
                todos[currentQuestion] && todos[currentQuestion].options.A
                  ? todos[currentQuestion].options.A
                  : undefined
              }
              checked={forCheckA}
              onChange={(e) => {
                setSelected(e.target.value);
                setForCheckA(true);
                setForCheckB(false);
                setForCheckC(false);
                setForCheckD(false);
              }}
              onClick={forSelectedOption}
            />
            <label>
              {todos[currentQuestion] && todos[currentQuestion].options.A
                ? todos[currentQuestion].options.A
                : undefined}
            </label>
            <br />
            <input
              type="radio"
              id={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              name={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              value={
                todos[currentQuestion] && todos[currentQuestion].options.B
                  ? todos[currentQuestion].options.B
                  : undefined
              }
              checked={forCheckB}
              onChange={(e) => {
                setSelected(e.target.value);
                setForCheckA(false);
                setForCheckB(true);
                setForCheckC(false);
                setForCheckD(false);
              }}
              onClick={forSelectedOption}
            />
            <label>
              {todos[currentQuestion] && todos[currentQuestion].options.B
                ? todos[currentQuestion].options.B
                : undefined}
            </label>
            <br />
            <input
              type="radio"
              id={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              name={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              checked={forCheckC}
              value={
                todos[currentQuestion] && todos[currentQuestion].options.C
                  ? todos[currentQuestion].options.C
                  : undefined
              }
              onChange={(e) => {
                setSelected(e.target.value);
                setForCheckA(false);
                setForCheckB(false);
                setForCheckC(true);
                setForCheckD(false);
              }}
              onClick={forSelectedOption}
            />
            <label>
              {todos[currentQuestion] && todos[currentQuestion].options.C
                ? todos[currentQuestion].options.C
                : undefined}
            </label>
            <br />
            <input
              type="radio"
              id={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              name={
                todos[currentQuestion] && todos[currentQuestion].todo
                  ? todos[currentQuestion].todo
                  : undefined
              }
              checked={forCheckD}
              value={
                todos[currentQuestion] && todos[currentQuestion].options.D
                  ? todos[currentQuestion].options.D
                  : undefined
              }
              onChange={(e) => {
                setSelected(e.target.value);
                setForCheckA(false);
                setForCheckB(false);
                setForCheckC(false);
                setForCheckD(true);
              }}
              onClick={forSelectedOption}
            />
            <label>
              {todos[currentQuestion] && todos[currentQuestion].options.D
                ? todos[currentQuestion].options.D
                : undefined}
            </label>

            {/* ======================================================== */}

            {/* <div>
              {todos.map((todo) => (
                <h3>{todo.todo}</h3>
              ))}
            </div> */}

            {/* {todos[0].todo} */}
            {/* =============
            {todos.map((todo, i) => (
              <TodoListItemStudent
                todo={todo.todo}
                notCompleted={todo.notCompleted}
                id={todo.id}
                options={todo.options}
                correctAnswer={todo.correctAnswer}
                index={i}
              />
            ))}========= */}
          </div>
          <div className="row">
            <Table>
              <tbody>
                <tr>
                  <td>
                    <Button
                      className="btn btn-primary w-100 mt-3"
                      style={{ maxWidth: "200px" }}
                      onClick={toSetPrevious}
                    >
                      Prev. Question
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="btn btn-success w-100 mt-3 "
                      style={{ maxWidth: "200px" }}
                      onClick={calculate}
                    >
                      Submit the Test
                    </Button>
                  </td>
                  <td>
                    <Button
                      className="btn btn-primary w-100 mt-3 "
                      style={{ maxWidth: "200px" }}
                      onClick={toSetNext}
                    >
                      Next Question
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
