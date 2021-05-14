import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";

function StudentListItem({
  id,
  name,
  emailId,
  marks,
  total,
  attend,
  CAnswer,
  Answer,
  index,
}) {
  const [error, setError] = useState("");
  const history = useHistory();
  function show() {
    // debugger;
    var Sid = id;
    if (attend === true) {
      setError("");

      try {
        history.push(`/student-Attend-showAns/${Sid}`);
      } catch {
        setError("Failed to log out");
      }
    } else {
      alert("This Student does not attend the Test yet.");
    }
  }
  return (
    <>
      <div>
        <table>
          <tbody>
            <tr>
              <th></th>
            </tr>
            <tr>
              <td width="20%">{index + 1}</td>
              <td width="20%">{name}</td>
              <td width="40%">{emailId}</td>
              <td width="10%">
                {marks ? marks + "/" : 0}
                {total}
              </td>
              <td width="20%">
                <button className="btn btn-danger" onClick={show}>
                  {attend ? "Show" : "Absent"}
                </button>
              </td>
            </tr>
            <tr>
              {" "}
              <br />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StudentListItem;
