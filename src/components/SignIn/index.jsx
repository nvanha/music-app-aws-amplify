import { Button, TextField } from "@material-ui/core";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const signIn = async () => {
    try {
      await Auth.signIn(username, password);
      history.push("/");
      onSignIn();
    } catch (error) {
      console.log("There was an error logging in", error);
    }
  };

  return (
    <div className="sign-in">
      <TextField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button id="signInButton" color="primary" onClick={signIn}>
        Sign In
      </Button>
    </div>
  );
};

export default SignIn;
