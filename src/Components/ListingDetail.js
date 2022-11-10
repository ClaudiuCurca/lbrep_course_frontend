import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

//React Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

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
  IconButton,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Breadcrumbs,
  Link,
  Dialog,
  Snackbar,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

//Components
import ListingUpdate from "./ListingUpdate";

function ListingDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const params = useParams();

  const initialState = {
    dataIsLoading: true,
    listingInfo: "",
    sellerProfileInfo: "",
    openSnack: false,
    disabledBtn: false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
      case "catchSellerProfileInfo":
        draft.sellerProfileInfo = action.profileObject;
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
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  // Request to get listing info
  useEffect(() => {
    async function GetListingInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/listings/${params.id}/` // import useParams and do this in order to you know what..
        );
        console.log(response.data);
        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetListingInfo();
  }, []);

  // Request to get seller info
  useEffect(() => {
    if (state.listingInfo) {
      async function GetProfileInfo() {
        try {
          const response = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/${state.listingInfo.seller}/` // import useParams and do this in order to you know what..
          );
          console.log(response.data);
          dispatch({
            type: "catchSellerProfileInfo",
            profileObject: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {
          console.log(e.response);
        }
      }
      GetProfileInfo();
    }
  }, [state.listingInfo]);

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture != null); // works kinda like a generator in python maybe??

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    if (currentPicture === listingPictures.length - 1) {
      return setCurrentPicture(0);
    } else {
      setCurrentPicture(currentPicture + 1);
    }
  }

  function PreviousPicture() {
    if (currentPicture === 0) {
      return setCurrentPicture(listingPictures.length - 1);
    } else {
      setCurrentPicture(currentPicture - 1);
    }
  }

  const date = new Date(state.listingInfo.date_posted);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  async function DeleteHandle() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirmDelete) {
      try {
        const response = await Axios.delete(
          `http://localhost:8000/api/listings/${params.id}/delete`
        );
        console.log(response.data);
        dispatch({ type: "openTheSnack" });
        dispatch({ type: "disableTheButton" });
      } catch (e) {
        dispatch({ type: "allowTheButton" });
        console.log(e.response.data);
      }
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 3000);
    }
  }, [state.openSnack]);

  // update dialog box
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <div
      style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}
    >
      <Grid item style={{ marginTop: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/listings")}
            style={{ cursor: "pointer" }}
          >
            Listings
          </Link>
          <Typography color="text.primary">
            {state.listingInfo.title}
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Image Slider */}
      {listingPictures.length > 0 ? (
        <Grid
          item
          container
          justifyContent="center"
          style={{ position: "relative", marginTop: "1rem" }}
        >
          {listingPictures.map((picture, index) => {
            return (
              <div key={index}>
                {index === currentPicture ? (
                  <img
                    src={picture}
                    style={{ width: "45rem", height: "35rem" }}
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}
          <ArrowCircleLeftIcon
            onClick={PreviousPicture}
            style={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              color: "white",
              top: "50%",
              left: "31.5%",
            }}
          />
          <ArrowCircleRightIcon
            onClick={NextPicture}
            style={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              color: "white",
              top: "50%",
              right: "31.5%",
            }}
          />
        </Grid>
      ) : (
        ""
      )}

      {/* More info */}

      <Grid
        item
        container
        style={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        {" "}
        <Grid item container xs={7} direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h5">{state.listingInfo.title}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              <RoomIcon /> {state.listingInfo.borough}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{formattedDate}</Typography>
          </Grid>
        </Grid>
        <Grid item container xs={5} alignItems="center">
          <Typography
            variant="h6"
            style={{ fontWeight: "bolder", color: "green" }}
          >
            {state.listingInfo.listing_type} |{" "}
            {state.listingInfo.property_status === "Sale"
              ? state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " EUR"
              : `${state.listingInfo.price}.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") EUR /${state.listingInfo.rental_frequency}`}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        justifyContent="flex-start"
        style={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        {state.listingInfo.rooms ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <Typography variant="h6">
              {state.listingInfo.rooms} Rooms
            </Typography>
          </Grid>
        ) : (
          ""
        )}
        {state.listingInfo.furnished ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Furnished</Typography>
          </Grid>
        ) : (
          ""
        )}
        {state.listingInfo.pool ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Pool</Typography>
          </Grid>
        ) : (
          ""
        )}
        {state.listingInfo.elevator ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Elevator</Typography>
          </Grid>
        ) : (
          ""
        )}
        {state.listingInfo.cctv ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Cctv</Typography>
          </Grid>
        ) : (
          ""
        )}
        {state.listingInfo.parking ? (
          <Grid item xs={2} style={{ display: "flex" }}>
            <CheckBoxIcon style={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Parking</Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {/* Description */}
      {state.listingInfo.description ? (
        <Grid
          item
          style={{
            padding: "1rem",
            border: "1px solid black",
            marginTop: "1rem",
          }}
        >
          <Typography variant="h5">Description</Typography>
          <Typography variant="h6">{state.listingInfo.description} </Typography>
        </Grid>
      ) : (
        ""
      )}

      {/* Map */}
      <Grid
        item
        container
        style={{
          height: "40rem",
          marginTop: "3rem",
          width: "75%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <MapContainer
          center={[state.listingInfo.latitude, state.listingInfo.longitude]}
          zoom={17}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[state.listingInfo.latitude, state.listingInfo.longitude]}
          >
            <Popup>{state.listingInfo.title}</Popup>
          </Marker>
        </MapContainer>
      </Grid>

      {/* Seller info */}
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
            style={{ height: "10rem", width: "15rem", cursor: "pointer" }}
            src={
              state.sellerProfileInfo.profile_picture !== null
                ? state.sellerProfileInfo.profile_picture
                : defaultProfilePicture
            }
            onClick={() =>
              navigate(`/agencies/${state.sellerProfileInfo.seller}`)
            }
          />
        </Grid>

        <Grid item container direction="column" justifyContent="center" xs={6}>
          <Grid item>
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <span style={{ color: "green", fontWeight: "bolder" }}>
                {state.sellerProfileInfo.agency_name}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            {" "}
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <IconButton>
                {" "}
                <LocalPhoneIcon /> {state.sellerProfileInfo.phone_number}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        {GlobalState.userId == state.listingInfo.seller ? (
          <Grid item container justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={DeleteHandle}
              disabled={state.disabledBtn}
            >
              Delete
            </Button>
            <Dialog open={open} onClose={handleClose} fullScreen>
              <ListingUpdate
                listingData={state.listingInfo}
                closeDialog={handleClose}
              />
            </Dialog>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      <Snackbar
        open={state.openSnack}
        message="You have successfully deleted the property"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default ListingDetail;
