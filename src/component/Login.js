import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import firebase from "firebase";

export default function Login() {
  const emailRef = useRef();
  const userRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [students, setStudents] = useState([]);

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
        }))
      );
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    debugger;

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      if (
        emailRef.current.value == "shubham@gmail.com" &&
        passwordRef.current.value == 11223344
      ) {
        history.push("/admin");
      } else {
        debugger;
        var eId = students.find((st) => {
          return st.emailId === emailRef.current.value;
        });
        if (eId !== undefined) {
          db.collection("students")
            .doc(eId.id)
            .update({ userName: userRef.current.value });
        } else {
          db.collection("students").add({
            userName: userRef.current.value,
            emailId: emailRef.current.value,
          });
        }
        history.push("/");
      }
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="w-100" style={{ minWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" ref={userRef} required />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>

              <Button disabled={loading} className="w-100" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account?<Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
}
