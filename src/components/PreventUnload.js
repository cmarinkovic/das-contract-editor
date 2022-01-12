//React
import { useEffect } from "react";

//Components

//Redux

//Styles

//Other

/**
 * Prevents unload of the window if appStarted === true
 *
 * @component
 */
const PreventUnload = () => {
  useEffect(() => {
    window.addEventListener("beforeunload", promptUser);

    return () => {
      window.removeEventListener("beforeunload", promptUser);
    };
  }, []);

  /**
   * Prompts user to confirm unload.
   *
   * @param {Object} e Triggered event.
   */
  const promptUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  return <></>;
};

export default PreventUnload;
