import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { useNavigate } from "react-router-dom";

//React leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";

// MUI
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
  IconButton,
  CardActions,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";

// Map icons
import houseIconPng from "./Assets/Mapicons/house.png";
import apartmentIconPng from "./Assets/Mapicons/apartment.png";
import officeIconPng from "./Assets/Mapicons/office.png";

//Assets
import img1 from "./Assets/img1.jpg";
import myListings from "./Assets/Data/Dummydata";
import { green, red, blue, yellow } from "@mui/material/colors";
import polygonOne from "./Shape";
import { Room } from "@mui/icons-material";

function Listings() {
  const navigate = useNavigate();

  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });
  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });
  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });

  const [latitude, setLatitude] = useState(47.648939199);
  const [longitude, setLongitude] = useState(26.2499927);

  const initialState = {
    mapInstance: null,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  // CORRECT WAY OF DEALING WITH DATA COMING FROM BACKEND
  const [allListings, setAllListings] = useState([]); // empty array at the beginning
  const [dataIsLoading, setDataIsLoading] = useState(true); // ! DATA IS LOADING = TRUE WHEN WE START THE PAGE

  // we use useEffect to load the data only when the page first loads
  useEffect(() => {
    const source = Axios.CancelToken.source();

    // we use async await to not deal with promises
    async function GetAllListings() {
      try {
        const response = await Axios.get("http://127.0.0.1:8000/api/listings", {
          cancelToken: source.token,
        });
        setAllListings(response.data);
        setDataIsLoading(false); // ! DATA HAS FINISHED LOADING
      } catch (error) {
        source.cancel();
      }
    }
    GetAllListings();

    //CLEANUP FUNCTION
    return () => {
      source.cancel();
    };
  }, []);

  //  if (data has finished loading)
  if (dataIsLoading === false) console.log(allListings[0]);

  if (dataIsLoading === true) {
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
  } // SHOWS WHILE DATA IS LOADING

  return (
    <Grid container>
      <Grid item xs={3.5}>
        {allListings.map((listing) => {
          return (
            <Card
              key={listing.id}
              style={{
                margin: "0.5rem",
                border: "1px solid black",
                position: "relative",
              }}
            >
              <CardHeader
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() =>
                      state.mapInstance.flyTo(
                        [listing.latitude, listing.longitude, longitude],
                        16
                      )
                    }
                  >
                    <RoomIcon />
                  </IconButton>
                }
                title={listing.title}
              />
              <CardMedia
                style={{
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  height: "20rem",
                  width: "30rem",
                  cursor: "pointer",
                }}
                component="img"
                image={listing.picture1}
                alt={listing.title}
                onClick={() => navigate(`/listings/${listing.id}`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 200) + "..."}
                </Typography>
              </CardContent>

              {listing.property_status === "Sale" ? (
                <Typography
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    zIndex: "1000",
                    color: "white",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                  }}
                >
                  {listing.listing_type}:{" "}
                  {listing.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " EUR"}
                </Typography>
              ) : (
                <Typography
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    zIndex: "1000",
                    color: "white",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                  }}
                >
                  {listing.listing_type}:{" "}
                  {listing.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " EUR"}{" "}
                  / {listing.rental_frequency}
                </Typography>
              )}

              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  {listing.seller_agency_name}
                </IconButton>
              </CardActions>
            </Card>
          );
        })}
      </Grid>
      <Grid item xs={8.5} style={{ marginTop: "0.5rem" }}>
        <AppBar position="sticky">
          {/*  sticky means that if i scroll down the properties map stays in one place*/}
          <div style={{ height: "100vh" }}>
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

              {allListings.map((listing) => {
                function IconDisplay() {
                  if (listing.listing_type === "House") {
                    return houseIcon;
                  } else if (listing.listing_type === "Apartment") {
                    return apartmentIcon;
                  } else if (listing.listing_type === "Office") {
                    return officeIcon;
                  }
                }

                return (
                  <Marker
                    key={listing.id}
                    icon={IconDisplay()}
                    position={[listing.latitude, listing.longitude]}
                  >
                    <Popup>
                      <Typography variant="h5">{listing.title}</Typography>
                      <img
                        src={listing.picture1}
                        style={{
                          height: "14rem",
                          width: "18rem",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      />
                      <Typography variant="body1">
                        {listing.description.substring(0, 150) + "..."}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      >
                        Details
                      </Button>
                    </Popup>
                  </Marker>
                );
              })}

              {/* <Marker icon={officeIcon} position={[latitude, longitude]}>
                <Popup>
                  <Typography variant="h5">A title</Typography>
                  <img src={img1} style={{ height: "14rem", width: "18rem" }} />
                  <Typography variant="body1">
                    This is some text below the title
                  </Typography>
                  <Button variant="contained" fullWidth>
                    A Link{" "}
                  </Button>
                </Popup>
              </Marker> */}
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Listings;
