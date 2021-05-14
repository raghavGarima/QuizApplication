import React, { useState, useRef } from "react";
import { Button, Table } from "react-bootstrap";
import { db } from "../firebase";

export default function TodoListItem({
  todo,
  notCompleted,
  id,
  toEdit,
  correctAnswer,
  options,
  setTodoInput,

  todoInput,
  optionA,
  optionB,
  optionC,
  optionD,
  correctAnswers,

  index,
  inputTextField,
  inputTextFieldA,
  inputTextFieldB,
  inputTextFieldC,
  inputTextFieldD,
  inputTextFieldCorrect,
  setOptionA,
  setOptionB,
  setOptionC,
  setOptionD,
  setCorrectAnswer,
}) {
  const inputRef = useRef();
  // const [forEdit, setForEdit] = useState("");
  const [hide, setHide] = useState(true);

  function deleteTodo() {
    db.collection("todos").doc(id).delete();
  }

  function editTodo() {
    // debugger;
    inputTextField.current.value = todo;
    inputTextFieldA.current.value = options.A;
    inputTextFieldB.current.value = options.B;
    inputTextFieldC.current.value = options.C;
    inputTextFieldD.current.value = options.D;
    inputTextFieldCorrect.current.value = correctAnswer;
    console.log(options);
    console.log(correctAnswer);

    setTodoInput(todo);
    setOptionA(options.A);
    setOptionB(options.B);
    setOptionC(options.C);
    setOptionD(options.D);
    setCorrectAnswer(correctAnswer);

    setHide(false);
    console.log(todoInput);
    console.log(optionA);
    console.log(optionB);
    console.log(optionC);
    console.log(optionD);
    console.log(correctAnswers);
    // console.log(notCompleted);
    // db.collection("todos").doc(id).update({
    //   toEdit: !toEdit,
    // });
    // if (toEdit === false) {
    //   db.collection("todos").doc(id).update({ todo: todoTnputF });
    //   setTodoInput("");
    //   setOptionA("");
    //   setOptionB("");
    //   setOptionC("");
    //   setOptionD("");
    //   setCorrectAnswer("");
    // }
    // console.log(notCompleted);
    // ============================

    // inputTextField.current.value = todo;
    // if (notCompleted === true) {
    // inputTextField.current.value = todo;
    //   console.log("before edited");
    // }
    // if (notCompleted === false) {
    //   console.log("Edited");
    // setTodoInput("");
    // }
  }

  function getNewFun() {}

  // function editTodo() {
  //   debugger;
  //   inputTextField.current.value = todo;
  //   console.log(todoInput);
  //   setTodoInput(inputTextField.current.value);
  //   console.log(todoInput);
  //   console.log(todoTnputF);
  //   var x = todos.find((tod) => {
  //     return tod.id === id;
  //   });
  //   console.log(x);
  //   // var y = todos.find((tod) => {
  //   //   if (tod.id === id) {
  //   //     // db.collection("todos").doc(id).update({ todo: todoTnputF });
  //   //   }
  //   // });
  //   // // setTodoTnputF("");
  //   setTodoInput("");
  // }

  // setForEdit("");

  // console.log(inputTextField.current.value);

  // console.log(todoTnputF);

  // var x = todos.find((tod) => {
  //   return tod.id === id;
  // });
  // console.log(x);
  // if (inputTextField.current.value !== todoTnputF) {
  // } else {
  //   db.collection("todos").doc(id).update({ todo: todoTnputF });
  // }
  // setTodoInput("");

  // if (todoTnputF == inputTextField.current.value) {
  //   console.log("Different");
  // } else {
  //   console.log("same");
  // }

  // setTodoTnputF(inputTextField.current.value);
  // console.log(todoTnputF);
  // setTodoInput(todoTnputF);
  // db.collection("todos").doc(id).update({ todo: todoTnputF });
  // console.log(todoTnputF);
  // setTodoInput("");
  //}
  // function conEditTodo() {
  //   db.collection("todos").doc(id).update({ todo: todoTnputF });
  //   // console.log(todoTnputF);
  //   setTodoInput("");
  // }
  function clickYes() {
    // debugger;
    db.collection("todos")
      .doc(id)
      .update({
        todo: todoInput,
        options: { A: optionA, B: optionB, C: optionC, D: optionD },
        correctAnswer: correctAnswers,
      });
    setTodoInput("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");

    setHide(true);
  }

  function clickNo() {
    // debugger;
    inputTextField.current.value = "";
    inputTextFieldA.current.value = "";
    inputTextFieldB.current.value = "";
    inputTextFieldC.current.value = "";
    inputTextFieldD.current.value = "";
    inputTextFieldCorrect.current.value = "";
    setTodoInput("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
    setHide(true);
  }

  return (
    <div>
      {/* <h3 className="d-flex align-items-left ">{todo}</h3>
      <Button className="d-flex align-item-right " onClick={deleteTodo}>
        Delete
      </Button> */}
      <Table class="table  ">
        <thead></thead>
        <tbody>
          <tr>
            <th scope="row"></th>
            <td width="10%">{index + 1}</td>

            <td width="60%">{todo}</td>
            <td width="30%">{correctAnswer}</td>
            <td>
              <Button
                className="d-flex align-button-right justify-content-right "
                onClick={deleteTodo}
              >
                Delete
              </Button>
            </td>
            <td width="50%">
              <Button
                className="d-flex align-item-right "
                ref={inputRef}
                onClick={editTodo}
              >
                Edit?
              </Button>
              <br />
              <div className="row">
                <button
                  className="btn btn-success col-1"
                  style={{ minWidth: "50px" }}
                  hidden={hide}
                  onClick={clickYes}
                >
                  Yes
                </button>
                <button
                  className="btn btn-danger col-2"
                  style={{ minWidth: "40px" }}
                  hidden={hide}
                  onClick={clickNo}
                >
                  No
                </button>
              </div>
            </td>
            {/* <td>
              <Button
                ref={inputRef}
                style={{ maxWidth: "100px" }}
                onClick={conEditTodo}
              >
                Done to Edit
              </Button>
            </td> */}
          </tr>
        </tbody>
      </Table>

      {/* <ListGroup>
        <ListGroupItem>
          <h3 className="d-flex align-items-left ">{todo}</h3>
          <Button className="d-flex align-item-right " onClick={deleteTodo}>
            Delete
          </Button>
        </ListGroupItem>
      </ListGroup> */}
    </div>
  );
}
