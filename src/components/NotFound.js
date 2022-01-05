//React
import { useEffect } from "react";
import { useNavigate } from "@reach/router";

//Components

//Redux

//Styles

//Other

/**
 * Redirects to Home if URL is invalid.
 * @component
 * @property {function} useEffect Redirects to "/" after render.
 */
const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <p>Sorry, nothing here...</p>;
};

export default NotFound;
