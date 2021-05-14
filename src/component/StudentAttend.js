import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import { Table, Button, Alert } from "react-bootstrap";
import StudentListItem from "./StudentListItem";

function StudentAttend() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    getStudents();
  }, []);

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

  async function home() {
    setError("");
    try {
      history.push("/admin");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <div className=" w-100" style={{ minWidth: "400px" }}>
        {/* <h2 className="text-center mb-4">Profile</h2> */}
        {error && <Alert variant="danger">{error}</Alert>}
        <h3 className="text-center mb-4">
          <strong>Admin-Id:</strong>
          <h3 className="text-info">{currentUser.email}</h3>
        </h3>
        <div className="w-100 text-right mt-2">
          <Button className="btn btn-success" onClick={home}>
            HOME
          </Button>
        </div>
      </div>
      <br />
      <div>
        <Table>
          <thead>
            <tr>
              <th width="20%">Student No.</th>
              <th width="20%">Student Name</th>
              <th width="40%">Email Id</th>
              <th width="10%">Marks</th>
              <th width="20%">Answer</th>
            </tr>
          </thead>
        </Table>
        <div>
          {students.map((student, i) => (
            <StudentListItem
              id={student.id}
              name={student.userName}
              emailId={student.emailId}
              marks={student.studentMarks}
              total={student.TotalMarks}
              attend={student.attend}
              CAnswer={student.correctAnswerS}
              Answer={student.selectedAnsSt}
              index={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default StudentAttend;
