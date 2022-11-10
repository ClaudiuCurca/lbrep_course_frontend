import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

// MUI IMPORTS
import {
  Button,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";

//Contexts
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";

function Header() {
  const navigate = useNavigate();

  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleProfile() {
    setAnchorEl(null);
    navigate("/profile");
  }

  const [openSnack, setOpenSnack] = useState(false);

  async function HandleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        const response = await Axios.post(
          "http://localhost:8000/api-auth-djoser/token/logout",
          GlobalState.userToken,
          { headers: { Authorization: "Token ".concat(GlobalState.userToken) } }
        );
        console.log(response);
        GlobalDispatch({ type: "logout" });
        setOpenSnack(true);
      } catch (e) {
        console.log(e.response);
      }
    }
  }

  useEffect(() => {
    if (openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 3000);
    }
  }, [openSnack]);

  return (
    <AppBar position="static" style={{ backgroundColor: "black" }}>
      <Toolbar>
        <div style={{ marginRight: "auto" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            <Typography variant="h4">LBREP</Typography>
          </Button>
        </div>
        <div>
          <Button
            color="inherit"
            style={{ marginRight: "1.5rem" }}
            onClick={() => navigate("/listings")}
          >
            <Typography variant="h6">Listings</Typography>
          </Button>
          <Button
            color="inherit"
            style={{ marginLeft: "1.5rem" }}
            onClick={() => navigate("/agencies")}
          >
            <Typography variant="h6">Agencies</Typography>
          </Button>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "10rem" }}>
          <Button
            color="inherit"
            style={{
              backgroundColor: "green",
              color: "white",
              width: "15rem",
              fontSize: "1.1rem",
              marginRight: "1rem",
            }}
            onClick={() => navigate("/addproperty")}
          >
            Add property
          </Button>

          {GlobalState.userIsLogged ? (
            <Button
              color="inherit"
              style={{
                backgroundColor: "white",
                color: "black",
                width: "15rem",
                fontSize: "1.1rem",
                marginLeft: "1rem",
              }}
              onClick={handleClick}
            >
              {GlobalState.userUsername}
            </Button>
          ) : (
            <Button
              color="inherit"
              style={{
                backgroundColor: "white",
                color: "black",
                width: "15rem",
                fontSize: "1.1rem",
                marginLeft: "1rem",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={HandleLogout}>Logout</MenuItem>
          </Menu>
          <Snackbar
            open={openSnack}
            message="You have successfully logged out"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
