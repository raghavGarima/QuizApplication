import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory, useParams } from "react-router-dom";
import { db } from "../firebase";
import { Table, Button, Alert } from "react-bootstrap";

function ShowSelectedAns() {
  const { SId } = useParams();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [currentSt, setCurrentSt] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);
  useEffect(() => {
    show();
  }, [getStudents]);

  function getStudents() {
    db.collection("students").onSnapshot(function (querySnapshot) {
      setStudents(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          userName: doc.data().userName,
          attend: doc.data().attend,
          emailId: doc.data().emailId,
          studentMarks: doc.data().studentMarks,
          TotalMarks: doc.data().TotalMarks,
          correctAnswerS: doc.data().correctAnswerS,
          selectedAnsSt: doc.data().selectedAnsSt,
        }))
      );
    });
  }

  function show() {
    // debugger;
    console.log(SId);
    var c = students.find((st) => {
      return st.id === SId;
    });
    console.log(c);
    setCurrentSt(c);
    console.log(currentSt);
  }

  async function home() {
    setError("");
    try {
      history.push("/admin");
    } catch {
      setError("Failed to log out");
    }
  }

  async function goBack() {
    setError("");
    try {
      history.push("/student-Attend");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <h1 className="text-info ">
        <u>Student Details</u>
      </h1>
      <div className="w-100 text-right mt-2">
        <Button className="btn btn-success" onClick={home}>
          HOME
        </Button>

        <Button className="btn btn-danger" onClick={goBack}>
          GO BACK
        </Button>
      </div>
      <div>
        <div>
          <h5>USER ID = {SId}</h5>
        </div>
        <table>
          <tr>
            <td width="50%">
              <h3>Student Name </h3>
            </td>
            <th width="10%"> : </th>
            <td>
              <h4>
                {currentSt && currentSt.userName
                  ? currentSt.userName
                  : undefined}
              </h4>
            </td>
          </tr>
          <tr>
            <td width="40%">
              <h3>Student Email </h3>
            </td>
            <th> : </th>
            <td>
              <h4>
                {currentSt && currentSt.emailId ? currentSt.emailId : undefined}
              </h4>
            </td>
          </tr>
          <tr>
            <td width="40%">
              <h3>Student Score </h3>
            </td>
            <th> : </th>
            <td>
              <h4>
                {currentSt && currentSt.studentMarks
                  ? currentSt.studentMarks
                  : undefined}
                /
                {currentSt && currentSt.TotalMarks
                  ? currentSt.TotalMarks
                  : undefined}
              </h4>
            </td>
          </tr>
        </table>
        <br />
        <div className="row">
          <div className="block col-1 w-100" style={{ minWidth: "400px" }}>
            <h5>CorrectAnswers:</h5>
            <table>
              <tr>
                <th>
                  <ul>
                    {currentSt && currentSt.correctAnswerS
                      ? currentSt.correctAnswerS.map((ans, index) => (
                          <div>
                            {index + 1} . {ans}
                          </div>
                        ))
                      : undefined}
                  </ul>
                </th>
              </tr>
            </table>
          </div>
          <div className="block col-2 w-100" style={{ minWidth: "400px" }}>
            <h5>Student Answers :</h5>
            <table>
              <tr>
                <th>
                  <ul>
                    {currentSt && currentSt.selectedAnsSt
                      ? currentSt.selectedAnsSt.map((ans, index) => (
                          <div>
                            {index + 1} . {ans}
                          </div>
                        ))
                      : undefined}
                  </ul>
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowSelectedAns;
