import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

//MUI
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";

// Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

function Login() {
  const navigate = useNavigate();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);

  const initialState = {
    usernameValue: "",
    passwordValue: "",
    sendRequest: 0,
    token: "",
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchToken":
        draft.token = action.tokenValue;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;
      case "disableTheButton":
        draft.disabledBtn = true;
        break;
      case "allowTheButton":
        draft.disabledBtn = false;
        break;
      case "catchServerError":
        draft.serverError = true;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log("The form has been submitted");
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();

      async function LogIn() {
        try {
          const response = await Axios.post(
            "http://localhost:8000/api-auth-djoser/token/login/",
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
          // THIS SENDS DATA TO THE GLOBAL STATE
          GlobalDispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
        } catch (error) {
          console.log(error.response);
          dispatch({ type: "allowTheButton" });
          dispatch({ type: "catchServerError" });
        }
      }
      LogIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  // Get user info
  useEffect(() => {
    if (state.token !== "") {
      const source = Axios.CancelToken.source();

      async function GetUserInfo() {
        try {
          const response = await Axios.get(
            "http://localhost:8000/api-auth-djoser/users/me/",
            {
              headers: { Authorization: "Token ".concat(state.token) },
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          GlobalDispatch({
            type: "userSignsIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            idInfo: response.data.id,
          });
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [state.openSnack]);

  return (
    <div
      style={{
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
      }}
    >
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">LOG IN</Typography>
        </Grid>
        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={state.usernameValue}
            onChange={(e) =>
              dispatch({
                type: "catchUsernameChange",
                usernameChosen: e.target.value,
              })
            }
            error={state.serverError ? true : false}
            helperText="There is an error on the field"
          />
        </Grid>
        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={state.passwordValue}
            onChange={(e) =>
              dispatch({
                type: "catchPasswordChange",
                passwordChosen: e.target.value,
              })
            }
            error={state.serverError ? true : false}
          />
        </Grid>

        <Grid
          item
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="contained"
            fullWidth
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              fontSize: "1.1rem",
              marginLeft: "1rem",
            }}
            disabled={state.disabledBtn}
          >
            LOG IN
          </Button>
        </Grid>

        {state.serverError ? (
          <Alert severity="error">Incorrect username or password!</Alert>
        ) : (
          ""
        )}
      </form>
      <Grid item container justifyContent="center">
        <Typography variant="small" style={{ marginTop: "1rem" }}>
          Don't have an account yet?{" "}
          <span
            style={{ cursor: "pointer", color: "green" }}
            onClick={() => navigate("/register")}
          >
            SIGN UP
          </span>
        </Typography>
      </Grid>
      <Snackbar
        open={state.openSnack}
        message="You have successfully logged in"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default Login;
