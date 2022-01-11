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
   * Filters elements from "loadedContractJSON" in a destructured array and sets result to "modelElements". Sets the state of the activities presence indicator.
   */
  const filterElements = () => {
    const superElementsArr = loadedContractJSON.elements[0].elements;

    const processArr = superElementsArr.filter((element) => {
      try {
        if (element.name === "bpmn2:process") {
          return true;
        }
      } catch (e) {}
    });

    /* const elementsArr = processArray[0].elements; //Only first found process elements are recovered. */

    const elementsWithinLanesArr = getElementsWithinLanesArr(processArr);
    const allElementsArr = getAllElementsArr(elementsWithinLanesArr);

    if (elementsWithinLanesArr) {
      const classifiedEelementsArr =
        getFullClassifiedElementsArr(allElementsArr);

      setModelElements(classifiedEelementsArr);

      classifiedEelementsArr
        ? setThereAreActivities(true)
        : setThereAreActivities(false);
    }
  };

  /**
   * Gets every element within every lane.
   * @param {Array} processArr Array of processes.
   * @returns {Array} Every element within every lane.
   */
  const getElementsWithinLanesArr = (processArr) => {
    const elementsWithinLanesArr = [];

    processArr.forEach((process) => {
      process.elements &&
        process.elements.forEach((element) => {
          elementsWithinLanesArr.push(element);
        });
    });

    return elementsWithinLanesArr;
  };

  /**
   * Gets every element in the process model.
   *
   * @param {Array} elementsWithinLanesArr Array of elements within lanes.
   * @returns {Array} Every element in the process model.
   */
  const getAllElementsArr = (elementsWithinLanesArr) => {
    const allElementsArr = [];

    elementsWithinLanesArr.forEach((element) => {
      if (element.name) {
        if (element.name === "bpmn2:subProcess") {
          allElementsArr.push(...getSubProcessTreeElementsArr(element));
        } else {
          allElementsArr.push(element);
        }
      }
    });

    return allElementsArr;
  };

  /**
   * Classifies an array of elements into 5 categories.
   *
   * @param {Array} elementsArr Array of elements.
   * @returns {Array} "Destructured" array of elements classified.
   */
  const getFullClassifiedElementsArr = (elementsArr) => {
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

    return [
      tasksWithoutType,
      userTasks,
      businessRuleTasks,
      scriptTasks,
      otherElements,
    ];
  };

  /**
   * Gets every non-subprocess element inside a subprocess tree.
   *
   * @param {Array} subProcessNode Current subProcess node.
   * @param {Array} treeElementsArr Array of tree elements.
   * @returns {Array} Every non-subprocess element inside a subprocess tree.
   */
  const getSubProcessTreeElementsArr = (
    subProcessNode,
    treeElementsArr = []
  ) => {
    subProcessNode.elements.forEach((element) => {
      if (element.name !== "bpmn2:subProcess") {
        treeElementsArr.push(element);
      } else {
        getSubProcessTreeElementsArr(element, treeElementsArr);
      }
    });
    return treeElementsArr;
  };

  /**
   * Updates a model element.
   *
   * @param {Object} modelElementToUpdate Model element to update.
   * @param {Object} newData New data for the model element to update.
   */
  const updateElement = (modelElementToUpdate, newData) => {
    updateModelElements(modelElementToUpdate, newData);

    if (loadedContractJSON) {
      const jointModelElements = joinArray(modelElements);

      const newLoadedContractJSON = loadedContractJSON;

      const superElementsArr = newLoadedContractJSON.elements[0].elements;

      jointModelElements.forEach((newElement) => {
        superElementsArr.forEach((element, elementIndex) => {
          try {
            if (
              element.name === "bpmn2:subProcess" ||
              element.name === "bpmn2:process"
            ) {
              superElementsArr[elementIndex] = updateTask(
                newElement,
                element,
                element
              );
            }
          } catch (e) {}
        });
      });

      newLoadedContractJSON.elements[0].elements = superElementsArr;

      setLoadedContractJSON(newLoadedContractJSON);

      updateLoadedContract();
    }
  };

  /**
   * Updates a task from a process or subprocess.
   *
   * @param {Object} newTask Task to update.
   * @param {Object} process Process or subprocess to update.
   */
  const updateTask = (process, newTask) => {
    process.elements.forEach((element) => {
      const [tasks, subProcesses, other] =
        getMinimalClassifiedElementsArr(element);

      tasks &&
        tasks.forEach((task, taskIndex) => {
          if (task.id === newTask.id) {
            task.elements[taskIndex] = newTask;
            return joinArray([tasks, subProcesses, other]);
          }
        });

      subProcesses &&
        subProcesses.forEach((subProcess) => {
          return updateTask(subProcess, newTask);
        });

      return process;
    });
  };

  /**
   * Classifies an array of elements into 3 categories.
   *
   * @param {Array} elementsArr Array of elements.
   * @returns {Array} "Destructured" array of elements classified.
   */
  const getMinimalClassifiedElementsArr = (elementsArr) => {
    const tasks = elementsArr.filter((element) => {
      return (
        element.name === "bpmn2:task" ||
        element.name === "bpmn2:userTask" ||
        element.name === "bpmn2:businessRuleTask" ||
        element.name === "bpmn2:scriptTask"
      );
    });

    const subProcesses = elementsArr.filter((element) => {
      return element.name === "bpmn2:subProcess";
    });

    const other = elementsArr.filter((element) => {
      return (
        element.name !== "bpmn2:task" &&
        element.name !== "bpmn2:userTask" &&
        element.name !== "bpmn2:businessRuleTask" &&
        element.name !== "bpmn2:scriptTask" &&
        element.name !== "bpmn2:subProcess"
      );
    });

    return [tasks, subProcesses, other];
  };

  /**
   * Updates an element in "modelElement".
   *
   * @param {Object} modelElementToUpdate Model element to update in "modelElements".
   * @param {Object} newData New data for the model element to update.
   */
  const updateModelElements = (modelElementToUpdate, newData) => {
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
                updateTask={updateElement}
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
                updateTask={updateElement}
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
                updateTask={updateElement}
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
