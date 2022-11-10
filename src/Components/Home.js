import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// MUI IMPORTS
import {
  Button,
  Typography,
  Grid,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@mui/material";

// Assets
import city from "./Assets/city.jpg";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ position: "relative" }}>
        <img src={city} style={{ width: "100%", height: "92vh" }} />
        <div
          style={{
            position: "absolute",
            zIndex: "100",
            top: "100px",
            left: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h1"
            style={{ color: "white", fontWeight: "bolder" }}
          >
            Find your <span style={{ color: "green" }}>next property</span> on
            the LBREP website
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/listings")}
            style={{
              fontSize: "3.5rem",
              borderRadius: "15px",
              backgroundColor: "green",
              marginTop: "2rem",
              boxShadow: "3px 3px 3px white",
            }}
          >
            SEE ALL PROPERTIES
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
