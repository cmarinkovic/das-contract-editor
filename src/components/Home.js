//React
import React from "react";
import { Link, useNavigate } from "@reach/router";

//Components
import PreventUnload from "./PreventUnload";

//Redux
import { connect } from "react-redux";
import { startApp } from "../redux/UI/ui-actions";

//Styles
import { Button } from "react-bootstrap";

//Other
import PropTypes from "prop-types";

/**
 * Provides an introduction or instructions for the user depending on appStarted.
 * 
 * @component
 */
const Home = ({ loadedContract, appStarted, startApp }) => {
  return (
    <div>
      {appStarted && <PreventUnload />}
      {appStarted || loadedContract ? (
        <Instructions />
      ) : (
        <Introduction startApp={startApp} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    appStarted: state.ui.appStarted,
    loadedContract: state.contracts.loadedContract,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startApp: () => dispatch(startApp()),
  };
};

Home.propTypes = {
  /**
   * Loaded contract JSON.
   */
  loadedContract: PropTypes.object,

  /**
   * App started indicator.
   */
  appStarted: PropTypes.bool.isRequired,

  /**
   * Action to set appStarted === true
   */
  startApp: PropTypes.func.isRequired,
};

/**
 *  Instructions for the user.
 *
 * @component
 */
const Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 my-4">
      <div className="col-lg-6 mx-auto">
        <h3 className="instructions-title">Instructions</h3>
        <div className="my-4">
          <ul className="lead">
            <li>
              <p>
                Model the contract process at the{" "}
                <Link to={"/process-editor"}>process editor.</Link>
              </p>
              <p className="instructions-description">
                Edit process model elements and their properties. Check model
                errors and warnings. Export the model.
              </p>
            </li>
            <li>
              <p>
                Edit{" "}
                <Link to={"/activity-properties"}>activity properties</Link>.
              </p>
              <p className="instructions-description">
                Edit form fields, a DMN model or script depending on the
                activity type.
              </p>
            </li>
            <li>
              <p>
                Edit <Link to={"/data-model"}>data model</Link>.
              </p>
              <p className="instructions-description">
                Edit entities and its primitive properties and reference
                properties.
              </p>
            </li>
            <li>
              <p>
                Export .dascontract file (XML) or image (SVG) at the{" "}
                <Link to={"/process-editor"}>process editor</Link>.
              </p>
            </li>
          </ul>
        </div>

        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Button
            onClick={() => navigate("process-editor")}
            className="px-4 mt-2"
            variant="outline-primary"
            size="lg"
          >
            Edit process
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 *  Introduction for the user.
 *
 * @component
 */
const Introduction = ({ startApp }) => {
  return (
    <div className="px-4 py-5 my-5 text-center">
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          A visual editor to design and generate model-driven smart contracts
          via the DasContract v2.0 visual domain specific language. Currently
          supports the Solidity programming language.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Button
            onClick={() => startApp()}
            className="px-4"
            variant="outline-primary"
            size="lg"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

Introduction.propTypes = {
  /**
   * Action to set appStarted === true
   */
  startApp: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
