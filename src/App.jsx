import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@material-ui/core";
import Amplify, { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import "./App.css";
import awsConfig from "./aws-exports";
import SongList from "./components/SongList";
import SignIn from "./components/SignIn";

Amplify.configure(awsConfig);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const accessLoggedInState = () => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        console.log('logged in')
        setLoggedIn(true);
      })
      .catch(() => {
        console.log('not logged in')
        setLoggedIn(false);
      });
  };

  useEffect(() => {
    accessLoggedInState();
  }, []);

  const signOut = async () => {
    try {
      await Auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.log("error signing out", error);
    }
  };

  const onSignIn = () => {
    setLoggedIn(true)
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {loggedIn ? (
            <Button variant="contained" color="primary" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <Link to="/sign-in">
              <Button variant="contained" color="primary">
                Sign In
              </Button>
            </Link>
          )}

          <h2>My App Content</h2>
        </header>
        <Switch>
          <Route exact path="/">
            <SongList />
          </Route>
          <Route path="/sign-in">
            <SignIn onSignIn={onSignIn} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
