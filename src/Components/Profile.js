import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

// Components
import ProfileUpdate from "./ProfileUpdate";

// MUI
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  CircularProgress,
} from "@mui/material";

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      bio: "",
      profilePic: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []);

  function PropertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button size="small" disabled>
          No Properties
        </Button>
      );
    } else if (state.userProfile.sellerListings.length === 1) {
      return (
        <Button
          size="small"
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
        >
          One Property listed
        </Button>
      );
    } else {
      return (
        <Button
          size="small"
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
        >
          {state.userProfile.sellerListings.length} Properties Listed
        </Button>
      );
    }
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          Welcome{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {GlobalState.userUsername}
          </span>
          , please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            border: "5px solid black",
            marginTop: "1rem",
            padding: "5px",
          }}
        >
          <Grid item xs={6}>
            <img
              style={{ height: "10rem", width: "15rem" }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>

          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            xs={6}
          >
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                Welcome{" "}
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {GlobalState.userUsername}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              {" "}
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                You have {PropertiesDisplay()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress></CircularProgress>
      </Grid>
    );
  }

  return (
    <>
      <div>{WelcomeDisplay()}</div>

      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
