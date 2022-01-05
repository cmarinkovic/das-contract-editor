import * as actionTypes from "./ui-types";

export const startApp = () => {
  return {
    type: actionTypes.START_APP,
    payload: {
      appStarted: true,
    },
  };
};
