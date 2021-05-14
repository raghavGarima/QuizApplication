import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Admin from "./Admin";
import NotAdmin from "./NotAdmin";
import ForOptions from "./AfterSubmit";
import StudentAttend from "./StudentAttend";
import ShowSelectedAns from "./ShowSelectedAns";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center "
      style={{ minHeight: "100vh" }}
    >
      <div>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/admin" component={Admin} />
              <Route path="/not-admin" component={NotAdmin} />
              <Route path="/not-admin-for" component={ForOptions} />
              <Route path="/student-Attend" component={StudentAttend} />
              <Route
                path="/student-Attend-showAns/:SId"
                component={ShowSelectedAns}
              />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
