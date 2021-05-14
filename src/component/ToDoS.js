import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { db } from "../firebase";

export default function TodoListItemStudent({ todo, notCompleted, id, index }) {
  function toDone() {
    db.collection("todos").doc(id).update({
      notCompleted: !notCompleted,
    });
    console.log("For students only");
  }

  return (
    <div>
      <table class="table  ">
        <thead></thead>
        <tbody>
          <tr>
            <th scope="row"></th>
            <td>{index + 1}</td>

            <td width="30%">{todo}</td>
            <td>{notCompleted ? "Not Completed" : "Completed"}</td>
            <td>
              <Button onClick={toDone}>
                {notCompleted ? "Done" : "Not Done"}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <ListGroup>
        <ListGroupItem>
          <h3 className="d-flex align-items-left ">{todo}</h3>

          <h6>{notCompleted ? "Not Completed" : "Completed"}</h6>
          <Button onClick={toDone}>{notCompleted ? "Done" : "Not Done"}</Button>
        </ListGroupItem>
      </ListGroup> */}
    </div>
  );
}
