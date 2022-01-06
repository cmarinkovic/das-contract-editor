import * as actionTypes from "./ui-types";

/**
 * Sets "appStarted" value to true.
 *
 * @returns {{string, Object}} Action result.
 */
export const startApp = () => {
  return {
    type: actionTypes.START_APP,
    payload: {
      appStarted: true,
    },
  };
};
