//React
import { useEffect } from "react";
import { useNavigate } from "@reach/router";

//Components

//Redux

//Styles

//Other

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <p>Sorry, nothing here...</p>;
};

export default NotFound;
