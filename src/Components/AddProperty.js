import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

//React Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

//MUI
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

//Contexts
import StateContext from "../Contexts/StateContext";

const areaOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Inner Suceava",
    label: "Inner Suceava",
  },
  {
    value: "Outer Suceava",
    label: "Outer Suceava",
  },
];

const innerSuceavaOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Centru",
    label: "Centru",
  },
  {
    value: "George Enescu",
    label: "George Enescu",
  },
  {
    value: "Obcini",
    label: "Obcini",
  },
  {
    value: "Burdujeni",
    label: "Burdujeni",
  },
  {
    value: "Marasesti",
    label: "Marasesti",
  },
  {
    value: "Zamca",
    label: "Zamca",
  },
  {
    value: "Itcani",
    label: "Itcani",
  },
];

const outerSuceavaOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Varatec",
    label: "Varatec",
  },
  {
    value: "Tisauti",
    label: "Tisauti",
  },
  {
    value: "Bosanci",
    label: "Bosanci",
  },
  {
    value: "Ipotesti",
    label: "Ipotesti",
  },
  {
    value: "Salcea",
    label: "Salcea",
  },
];

const listingTypeOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Apartment",
    label: "Apartment",
  },
  {
    value: "House",
    label: "House",
  },
  {
    value: "Office",
    label: "Office",
  },
];

const propertyStatusOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Sale",
    label: "Sale",
  },
  {
    value: "Rent",
    label: "Rent",
  },
];

const rentalFrequencyOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Month",
    label: "Month",
  },
  {
    value: "Week",
    label: "Week",
  },
  {
    value: "Day",
    label: "Day",
  },
];

function AddProperty() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: "",
    listingTypeValue: "",
    descriptionValue: "",
    areaValue: "",
    boroughValue: "",
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    picture4Value: "",
    picture5Value: "",
    mapInstance: null,
    markerPosition: {
      lat: "47.648939199",
      lng: "26.2499927",
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
    disabledBtn: false,
    titleErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    areaErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    boroughErrors: {
      hasErrors: false,
      errorMessage: "",
    },
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        draft.titleErrors.hasErrors = false;
        draft.titleErrors.errorMessage = "";
        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        draft.listingTypeErrors.hasErrors = false;
        draft.listingTypeErrors.errorMessage = "";
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;
      case "catchAreaChange":
        draft.areaValue = action.areaChosen;
        draft.areaErrors.hasErrors = false;
        draft.areaErrors.errorMessage = "";
        break;
      case "catchBoroughChange":
        draft.boroughValue = action.boroughChosen;
        draft.boroughErrors.hasErrors = false;
        draft.boroughErrors.errorMessage = "";
        break;
      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;
      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
        break;
      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        draft.propertyStatusErrors.hasErrors = false;
        draft.propertyStatusErrors.errorMessage = "";
        break;
      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        draft.priceErrors.hasErrors = false;
        draft.priceErrors.errorMessage = "";
        break;
      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;
      case "catchRoomsChange":
        draft.roomsValue = action.roomsChosen;
        break;
      case "catchFurnishedChange":
        draft.furnishedValue = action.furnishedChosen;
        break;
      case "catchPoolChange":
        draft.poolValue = action.poolChosen;
        break;
      case "catchElevatorChange":
        draft.elevatorValue = action.elevatorChosen;
        break;
      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;
      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;
      case "catchPicture1Change":
        draft.picture1Value = action.picture1Chosen;
        break;
      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;
      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;
      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;
      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
        break;
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        // WHEN WE CHANGE THE BOROUGH THE MARKER COMES THER AND ALSO
        draft.latitudeValue = "";
        draft.longitudeValue = "";
        // THE lat and long values are set to ""
        break;
      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
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
      case "catchTitleErrors":
        if (action.titleChosen.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = "This field must not be empty";
        }
        break;
      case "catchListingTypeErrors":
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = "This field must not be empty";
        }
        break;
      case "catchPropertyStatusErrors":
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            "This field must not be empty";
        }
        break;
      case "catchPriceErrors":
        if (action.priceChosen.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = "This field must not be empty";
        }
        break;
      case "catchAreaErrors":
        if (action.areaChosen.length === 0) {
          draft.areaErrors.hasErrors = true;
          draft.areaErrors.errorMessage = "This field must not be empty";
        }
        break;
      case "catchAreaErrors":
        if (action.boroughChosen.length === 0) {
          draft.boroughErrors.hasErrors = true;
          draft.boroughErrors.errorMessage = "This field must not be empty";
        }
        break;
      case "emptyTitle":
        draft.titleErrors.hasErrors = true;
        draft.titleErrors.errorMessage = "This field must not be empty";
        break;
      case "emptyListingType":
        draft.listingTypeErrors.hasErrors = true;
        draft.listingTypeErrors.errorMessage = "This field must not be empty";
        break;
      case "emptyPropertyStatus":
        draft.propertyStatusErrors.hasErrors = true;
        draft.propertyStatusErrors.errorMessage =
          "This field must not be empty";
        break;
      case "emptyPrice":
        draft.priceErrors.hasErrors = true;
        draft.priceErrors.errorMessage = "This field must not be empty";
        break;
      case "emptyArea":
        draft.areaErrors.hasErrors = true;
        draft.areaErrors.errorMessage = "This field must not be empty";
        break;
      case "emptyBorough":
        draft.boroughErrors.hasErrors = true;
        draft.boroughErrors.errorMessage = "This field must not be empty";
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  // Use effect to change the map view
  useEffect(() => {
    if (state.boroughValue === "Centru") {
      state.mapInstance.setView([47.64494969925407, 26.259895042155182], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.64494969925407,
        changeLongitude: 26.259895042155182,
      });
    } else if (state.boroughValue === "George Enescu") {
      state.mapInstance.setView([47.64408204501342, 26.239407801362056], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.64408204501342,
        changeLongitude: 26.239407801362056,
      });
    } else if (state.boroughValue === "Obcini") {
      state.mapInstance.setView([47.63738255237402, 26.23204013892002], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.63738255237402,
        changeLongitude: 26.23204013892002,
      });
    } else if (state.boroughValue === "Burdujeni") {
      state.mapInstance.setView([47.67227156682597, 26.27963342477326], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.67227156682597,
        changeLongitude: 26.27963342477326,
      });
    } else if (state.boroughValue === "Marasesti") {
      state.mapInstance.setView([47.64553232835825, 26.24849237506874], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.64553232835825,
        changeLongitude: 26.24849237506874,
      });
    } else if (state.boroughValue === "Zamca") {
      state.mapInstance.setView([47.65058179772654, 26.24920523078397], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.65058179772654,
        changeLongitude: 26.24920523078397,
      });
    } else if (state.boroughValue === "Itcani") {
      state.mapInstance.setView([47.678306032002084, 26.23816228914242], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.678306032002084,
        changeLongitude: 26.23816228914242,
      });
    } else if (state.boroughValue === "Varatec") {
      state.mapInstance.setView([47.6388042988784, 26.399567040066195], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.6388042988784,
        changeLongitude: 26.399567040066195,
      });
    } else if (state.boroughValue === "Tisauti") {
      state.mapInstance.setView([47.62437308711814, 26.308650957803493], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.62437308711814,
        changeLongitude: 26.308650957803493,
      });
    } else if (state.boroughValue === "Itcani") {
      state.mapInstance.setView([47.678306032002084, 26.23816228914242], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.678306032002084,
        changeLongitude: 26.23816228914242,
      });
    } else if (state.boroughValue === "Bosanci") {
      state.mapInstance.setView([47.58776377111197, 26.313715874551955], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.58776377111197,
        changeLongitude: 26.313715874551955,
      });
    } else if (state.boroughValue === "Ipotesti") {
      state.mapInstance.setView([47.621007336626844, 26.283142033013506], 16);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.621007336626844,
        changeLongitude: 26.283142033013506,
      });
    } else if (state.boroughValue === "Salcea") {
      state.mapInstance.setView([47.65113513214367, 26.3718652213755], 15);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 47.65113513214367,
        changeLongitude: 26.3718652213755,
      });
    }
  }, [state.boroughValue]);

  // Draggable Marker

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  // Catching picture fields
  useEffect(() => {
    if (state.uploadedPictures[0])
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1])
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2])
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3])
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4])
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
  }, [state.uploadedPictures[4]]);

  // request to get profile info
  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
      } catch (e) {
        console.log(e.response);
      }
    }
    GetProfileInfo();
  }, []); // empty [] means it will run each time the page loads

  function FormSubmit(e) {
    e.preventDefault();
    console.log("The form has been submitted");
    if (
      !state.titleErrors.hasErrors &&
      !state.listingTypeErrors.hasErrors &&
      !state.propertyStatusErrors.hasErrors &&
      !state.priceErrors.hasErrors &&
      !state.areaErrors.hasErrors &&
      !state.boroughErrors.hasErrors &&
      state.latitudeValue &&
      state.longitudeValue
    ) {
      dispatch({ type: "changeSendRequest" });
      dispatch({ type: "disableTheButton" });
    } else if (state.titleValue === "") {
      dispatch({ type: "emptyTitle" });
      window.scrollTo(0, 0);
    } else if (state.listingTypeValue === "") {
      dispatch({ type: "emptyListingType" });
      window.scrollTo(0, 0);
    } else if (state.propertyStatusValue === "") {
      dispatch({ type: "emptyPropertyStatus" });
      window.scrollTo(0, 0);
    } else if (state.priceValue === "") {
      dispatch({ type: "emptyPrice" });
      window.scrollTo(0, 0);
    } else if (state.areaValue === "") {
      dispatch({ type: "emptyArea" });
      window.scrollTo(0, 0);
    } else if (state.boroughValue === "") {
      dispatch({ type: "emptyBorough" });
      window.scrollTo(0, 0);
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function Addproperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("area", state.areaValue);
        formData.append("borough", state.boroughValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("price", state.priceValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("rooms", state.roomsValue);
        formData.append("furnished", state.furnishedValue);
        formData.append("pool", state.poolValue);
        formData.append("elevator", state.elevatorValue);
        formData.append("cctv", state.cctvValue);
        formData.append("parking", state.parkingValue);
        formData.append("latitude", state.latitudeValue);
        formData.append("longitude", state.longitudeValue);
        formData.append("picture1", state.picture1Value);
        formData.append("picture2", state.picture2Value);
        formData.append("picture3", state.picture3Value);
        formData.append("picture4", state.picture4Value);
        formData.append("picture5", state.picture5Value);
        formData.append("seller", GlobalState.userId);

        try {
          const response = await Axios.post(
            "http://localhost:8000/api/listings/create/",
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (e) {
          console.log(e.response);
          dispatch({ type: "allowTheButton" });
        }
      }
      Addproperty();
    }
  }, [state.sendRequest]);

  function PriceDisplay() {
    if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Day"
    )
      return "Price per Day";
    else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Week"
    )
      return "Price per Week";
    else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Month"
    )
      return "Price per Month";
    else return "Price";
  }

  function SubmitButtonDisplay() {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.agencyName !== null &&
      state.userProfile.agencyName !== "" &&
      state.userProfile.phoneNumber !== null &&
      state.userProfile.phoneNumber !== ""
    ) {
      return (
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
          SUBMIT
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (state.userProfile.agencyName === null ||
        state.userProfile.agencyName === "" ||
        state.userProfile.phoneNumber === null ||
        state.userProfile.phoneNumber === "")
    ) {
      return (
        <Button
          variant="outlined"
          fullWidth
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "1.1rem",
            marginLeft: "1rem",
          }}
          onClick={() => navigate("/profile")}
        >
          COMPLETE YOUR PROFILE TO ADD A PROPERTY
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          variant="outlined"
          fullWidth
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "1.1rem",
            marginLeft: "1rem",
          }}
          onClick={() => navigate("/login")}
        >
          LOG IN TO ADD A PROPERTY
        </Button>
      );
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 3000);
    }
  }, [state.openSnack]);

  return (
    <div
      style={{
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
      }}
    >
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">SUBMIT A PROPERTY</Typography>
        </Grid>

        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="title"
            label="Title*"
            variant="standard"
            fullWidth
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({
                type: "catchTitleErrors",
                titleChosen: e.target.value,
              })
            }
            error={state.titleErrors.hasErrors ? true : false}
            helperText={state.titleErrors.errorMessage}
          />
        </Grid>

        <Grid item container justifyContent="space-between">
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="listingType"
              label="Listing Type*"
              variant="standard"
              fullWidth
              value={state.listingTypeValue}
              onChange={(e) =>
                dispatch({
                  type: "catchListingTypeChange",
                  listingTypeChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchListingTypeErrors",
                  listingTypeChosen: e.target.value,
                })
              }
              error={state.listingTypeErrors.hasErrors ? true : false}
              helperText={state.listingTypeErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="propertyStatus"
              label="Property Status*"
              variant="standard"
              fullWidth
              value={state.propertyStatusValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPropertyStatusChange",
                  propertyStatusChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchPropertyStatusErrors",
                  propertyStatusChosen: e.target.value,
                })
              }
              error={state.propertyStatusErrors.hasErrors ? true : false}
              helperText={state.propertyStatusErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {propertyStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item container justifyContent="space-between">
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="rentalFrequency"
              label="Rental Frequency"
              variant="standard"
              // this is cool
              disabled={state.propertyStatusValue === "Sale" ? true : false}
              fullWidth
              value={state.rentalFrequencyValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRentalFrequencyChange",
                  rentalFrequencyChosen: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {rentalFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="price"
              label={PriceDisplay() + "*"}
              variant="standard"
              type="number" // This doesn't allow to input letters
              fullWidth
              value={state.priceValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPriceChange",
                  priceChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchPriceErrors",
                  priceChosen: e.target.value,
                })
              }
              error={state.priceErrors.hasErrors ? true : false}
              helperText={state.priceErrors.errorMessage}
            />
          </Grid>
        </Grid>

        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            value={state.descriptionValue}
            onChange={(e) =>
              dispatch({
                type: "catchDescriptionChange",
                descriptionChosen: e.target.value,
              })
            }
          />
        </Grid>

        {state.listingTypeValue === "Office" ? (
          ""
        ) : (
          <Grid item xs={3} style={{ marginTop: "1rem" }}>
            <TextField
              id="rooms"
              label="Rooms"
              variant="standard"
              type="number"
              fullWidth
              value={state.roomsValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRoomsChange",
                  roomsChosen: e.target.value,
                })
              }
            />
          </Grid>
        )}

        <Grid item container justifyContent="space-between">
          {" "}
          <Grid item style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.furnishedValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchFurnishedChange",
                      furnishedChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Furnished"
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.poolValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchPoolChange",
                      poolChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Pool"
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.elevatorValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchElevatorChange",
                      elevatorChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Elevator"
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.cctvValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchCctvChange",
                      cctvChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Cctv"
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.parkingValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchParkingChange",
                      parkingChosen: e.target.checked,
                    })
                  }
                />
              }
              label="Parking"
            />
          </Grid>
        </Grid>

        <Grid item container justifyContent="space-between">
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="area"
              label="Area*"
              variant="standard"
              fullWidth
              value={state.areaValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAreaChange",
                  areaChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchAreaErrors",
                  areaChosen: e.target.value,
                })
              }
              error={state.areaErrors.hasErrors ? true : false}
              helperText={state.areaErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="borough"
              label="Borough*"
              variant="standard"
              fullWidth
              value={state.boroughValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBoroughChange",
                  boroughChosen: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchBoroughErrors",
                  boroughChosen: e.target.value,
                })
              }
              error={state.boroughErrors.hasErrors ? true : false}
              helperText={state.boroughErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {state.areaValue === "Inner Suceava"
                ? innerSuceavaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : " "}
              {state.areaValue === "Outer Suceava"
                ? outerSuceavaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : " "}
            </TextField>
          </Grid>
        </Grid>

        {/* Map */}
        <Grid item style={{ marginTop: "1rem" }}>
          {state.latitudeValue && state.longitudeValue ? (
            <Alert severity="success">
              Your property is located @ {state.latitudeValue},{" "}
              {state.longitudeValue}
            </Alert>
          ) : (
            <Alert severity="warning">
              Locate your property on the map before submitting this form
            </Alert>
          )}
        </Grid>
        <Grid item container style={{ height: "35rem", marginTop: "1rem" }}>
          <MapContainer
            center={[47.648939199, 26.2499927]}
            zoom={16}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TheMapComponent />
            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
        </Grid>

        <Grid
          item
          container
          xs={6}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="contained"
            fullWidth
            component="label"
            style={{
              backgroundColor: "blue",
              color: "white",
              fontSize: "0.8rem",
              border: "1px solid black",
              marginLeft: "1rem",
            }}
          >
            UPLOAD PICTURES (MAX 5)
            <input
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg"
              hidden
              onChange={(e) =>
                dispatch({
                  type: "catchUploadedPictures",
                  picturesChosen: e.target.files,
                })
              }
            />
          </Button>
        </Grid>

        <Grid item container>
          <ul>
            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
          </ul>
        </Grid>

        <Grid
          item
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          {SubmitButtonDisplay()}
        </Grid>
      </form>
      <Snackbar
        open={state.openSnack}
        message="You have successfully added a property"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default AddProperty;
