//React
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@reach/router";

//Components
import ProcessViewer from "./ProcessViewer";
import NoTypeActivity from "./NoTypeActivity";
import UserActivityFormFields from "./UserActivityFormFields";
import ScriptActivity from "./ScriptActivity";
import BusinessRuleActivity from "./BusinessRuleActivity";
import SavedToast from "./SavedToast";

//Redux
import { connect } from "react-redux";
import { loadContract } from "../redux/Contracts/contracts-actions";

//Styles
import { Container, Row } from "react-bootstrap";

//Others
import convert from "xml-js";
import PreventUnload from "./PreventUnload";
import PropTypes from "prop-types";

/**
 * Enables editing activity DasContract properties. Shows a process viewer for reference.
 *
 * @component
 */
const ActivityDasContractProperties = ({
  appStarted,
  loadedContract,
  loadContract,
  loadContractError,
}) => {
  //Data load
  /**
   * Loaded contract in JSON format state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [loadedContractJSON, setLoadedContractJSON] = useState();

  useEffect(() => {
    if (loadedContract && !loadContractError) {
      setLoadedContractJSON(
        JSON.parse(
          convert.xml2json(loadedContract.xml, {
            compact: false,
            spaces: 4,
          })
        )
      );
    }

    redirectIfNotReady();
  }, []);

  const navigate = useNavigate();

  /**
   * Redirects the user to "Home" if there's no loaded contract or a load contract error.
   */
  const redirectIfNotReady = () => {
    if (!appStarted) {
      navigate("/");
    } else if (!loadedContract || loadContractError) {
      navigate("/process-editor");
    }
  };

  //Data manipulation
  /**
   * Model elements state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [modelElements, setModelElements] = useState();

  /**
   * Activity presence indicator state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [thereAreActivities, setThereAreActivities] = useState(false);

  useEffect(() => {
    loadedContractJSON && filterElements();
  }, [loadedContractJSON]);

  /**
   * Filters tasks from "loadedContractJSON" in a destructured array and sets result to "modelElements". Sets the state of the activities presence indicator.
   */
  const filterElements = () => {
    const superElementsArr = loadedContractJSON.elements[0].elements;

    const processArray = superElementsArr.filter((element) => {
      return element.name === "bpmn2:process";
    });

    const elementsArr = processArray[0].elements;

    if (elementsArr) {
      const tasksWithoutType = elementsArr.filter((element) => {
        return element.name === "bpmn2:task";
      });

      const userTasks = elementsArr.filter((element) => {
        return element.name === "bpmn2:userTask";
      });

      const businessRuleTasks = elementsArr.filter((element) => {
        return element.name === "bpmn2:businessRuleTask";
      });

      const scriptTasks = elementsArr.filter((element) => {
        return element.name === "bpmn2:scriptTask";
      });

      const otherElements = elementsArr.filter((element) => {
        return (
          element.name !== "bpmn2:task" &&
          element.name !== "bpmn2:userTask" &&
          element.name !== "bpmn2:businessRuleTask" &&
          element.name !== "bpmn2:scriptTask" &&
          element.name !== "bpmn2:subProcess"
        );
      });

      setModelElements([
        tasksWithoutType,
        userTasks,
        businessRuleTasks,
        scriptTasks,
        otherElements,
      ]);

      if (
        tasksWithoutType.length ||
        userTasks.length ||
        businessRuleTasks.length ||
        scriptTasks.length
      ) {
        setThereAreActivities(true);
      }
    } else {
      setThereAreActivities(false);
    }
  };

  /**
   * Updated a task.
   *
   * @param {Object} modelElementToUpdate Model element to update in "modelElements".
   * @param {Object} newData New data for the model element to update.
   */
  const updateTask = (modelElementToUpdate, newData) => {
    let newModelElements;

    newModelElements = [...modelElements];

    newModelElements.forEach((newModelElementType) => {
      newModelElementType.forEach((newModelElement) => {
        if (
          newModelElement.attributes.id === modelElementToUpdate.attributes.id
        ) {
          newModelElement.attributes["dascontract:activity-properties"] =
            newData;
        }
      });
    });

    setModelElements(newModelElements);

    if (loadedContractJSON) {
      const jointModelElementTypes = joinArray(modelElements);

      const newLoadedContractJSON = loadedContractJSON;

      const superElementsArray = newLoadedContractJSON.elements[0].elements;
      const elementsArrayIndex = superElementsArray.findIndex((element) => {
        return element.name === "bpmn2:process";
      });

      newLoadedContractJSON.elements[0].elements[elementsArrayIndex].elements =
        jointModelElementTypes;

      setLoadedContractJSON(newLoadedContractJSON);

      updateLoadedContract();
    }
  };

  /**
   * Joins a destructured array into a "joint" array.
   *
   * @param {Array} arr Array to be joined.
   * @returns
   */
  const joinArray = (arr) => {
    const jointArray = [];

    arr.forEach((arrElement) => {
      jointArray.push(...arrElement);
    });

    return jointArray;
  };

  /**
   * Toggle saved modal reference hook.
   * @constant
   *
   * @type {Object}
   */
  const toggleSavedToastRef = useRef(() => {});

  /**
   * Updates "loadedContract" from the store with the data in "loadedContractJSON".
   */
  const updateLoadedContract = () => {
    const newXML = convert.json2xml(loadedContractJSON, {
      compact: false,
      spaces: 4,
    });

    loadContract({
      ...loadedContract,
      xml: newXML,
    });

    toggleSavedToastRef.current();
  };

  //TODO: Markup can be modified for react-bootstrap.
  return (
    <Container className={`${loadContractError && "d-none"}`} fluid={true}>
      {appStarted && <PreventUnload />}
      {appStarted && <SavedToast toggle={toggleSavedToastRef} ms={5000} />}

      <Row>
        <ProcessViewer />
      </Row>
      <Row className={`${thereAreActivities && "d-none"} mt-2`}>
        <div className="px-4 py-5 my-2 text-center">
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4 note">
              Add some activities at the{" "}
              <Link to={"/process-editor"}>process editor</Link> to begin.
            </p>
          </div>
        </div>
      </Row>
      <Row className="mt-2">
        {modelElements &&
          modelElements[0].map((task) => {
            return <NoTypeActivity key={task.attributes.id} task={task} />;
          })}
      </Row>
      <Row className="mt-2">
        {modelElements &&
          modelElements[1].map((task) => {
            return (
              <UserActivityFormFields
                key={task.attributes.id}
                task={task}
                updateTask={updateTask}
                loadedContractJSON={loadedContractJSON}
              />
            );
          })}
      </Row>
      <Row className="mt-2">
        {modelElements &&
          modelElements[3].map((task) => {
            return (
              <ScriptActivity
                key={task.attributes.id}
                task={task}
                updateTask={updateTask}
              />
            );
          })}
      </Row>

      <Row className="mt-2">
        {modelElements &&
          modelElements[2].map((task) => {
            return (
              <BusinessRuleActivity
                key={task.attributes.id}
                task={task}
                updateTask={updateTask}
              />
            );
          })}
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    appStarted: state.ui.appStarted,
    loadedContract: state.contracts.loadedContract,
    loadContractError: state.contracts.loadContractError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadContract: (contract) => dispatch(loadContract(contract)),
  };
};

ActivityDasContractProperties.propTypes = {
  /**
   * App started indicator from store.
   */
  appStarted: PropTypes.bool,

  /**
   * Loaded contract from store.
   */
  loadedContract: PropTypes.object,

  /**
   * Action to load a contract in the store.
   */
  loadContract: PropTypes.func.isRequired,

  /**
   * Load contract error indicator from store.
   */
  loadContractError: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityDasContractProperties);
