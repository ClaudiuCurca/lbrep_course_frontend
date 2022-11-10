import React from "react";

// React props - add props in the arguments of the function
function Fruit(props) {
  return (
    <div>
      This is a {props.color} {props.name}
    </div>
  );
}

export default Fruit;
