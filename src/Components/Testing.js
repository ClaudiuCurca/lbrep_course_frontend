import { Button } from "@mui/material";
import React, { useEffect, useState, useReducer } from "react";
import { useImmerReducer } from "use-immer";

// useEffect hook lets us do something while something else happens
function Testing() {
  const initialState = {
    appleCount: 1,
    bananaCount: 10,
    message: "Hello",
    happy: false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "addApple":
        draft.appleCount = draft.appleCount + 1;
        break;
      case "changeEverything":
        draft.bananaCount = draft.bananaCount + 10;
        draft.message = action.customMessage;
        draft.happy = true;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  return (
    <>
      <div>Right now the count of apples is {state.appleCount} </div>
      <div>Right now the count of bananas is {state.bananaCount} </div>
      <div>Right now the message is {state.message} </div>
      {state.happy ? (
        <h1>Thank you for being happy!</h1>
      ) : (
        <h1>There's no happiness</h1>
      )}

      <br />
      <Button onClick={() => dispatch({ type: "addApple" })}>Add apple</Button>
      <br />
      <Button
        onClick={() =>
          dispatch({
            type: "changeEverything",
            customMessage: "The message is now coming from the dispatch",
          })
        }
      >
        Change everything
      </Button>
    </>
  );
}
export default Testing;
