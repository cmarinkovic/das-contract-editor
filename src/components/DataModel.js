//React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "@reach/router";

//Components
import DataModelFormFields from "./DataModelFormFields";
import ProcessViewer from "./ProcessViewer";
import SavedToast from "./SavedToast";
import PreventUnload from "./PreventUnload";

//Redux
import { connect } from "react-redux";
import { loadContract } from "../redux/Contracts/contracts-actions";

//Styles
import { Container, Row } from "react-bootstrap";

//Other
import convert from "xml-js";

const DataModel = ({
  appStarted,
  loadedContract,
  loadContract,
  loadContractError,
}) => {
  //Data load
  let [loadedContractJSON, setLoadedContractJSON] = useState();

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

  const redirectIfNotReady = () => {
    if (!appStarted) {
      navigate("/");
    } else if (!loadedContract || loadContractError) {
      navigate("/process-editor");
    }
  };

  //Data manipulation
  const [modelElements, setModelElements] = useState();

  useEffect(() => {
    loadedContractJSON && filterRootProcess();
  }, [loadedContractJSON]);

  const filterRootProcess = () => {
    const elementsArr = loadedContractJSON.elements[0].elements;

    const rootProcess = elementsArr.filter((element) => {
      return element.name === "bpmn2:process";
    });

    const otherElements = elementsArr.filter((element) => {
      return element.name !== "bpmn2:process";
    });

    setModelElements([rootProcess, otherElements]);
  };

  const updateProcess = (modelElementToUpdate, newData) => {
    let newModelElements;

    newModelElements = [...modelElements];

    newModelElements.forEach((newModelElementType) => {
      newModelElementType.forEach((newModelElement) => {
        if (
          newModelElement.attributes.id === modelElementToUpdate.attributes.id
        ) {
          newModelElement.attributes["dascontract:data-model"] = newData;
        }
      });
    });

    setModelElements(newModelElements);

    if (loadedContractJSON) {
      const jointModelElementTypes = [];

      modelElements.forEach((modelElementType) => {
        jointModelElementTypes.push(...modelElementType);
      });

      const newLoadedContractJSON = loadedContractJSON;

      newLoadedContractJSON.elements[0].elements = jointModelElementTypes;

      setLoadedContractJSON(newLoadedContractJSON);

      updateLoadedContract();
    }
  };

  const toggleSavedToastRef = useRef(() => {});

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

  return (
    <Container className={`${loadContractError && "d-none"}`} fluid={true}>
      {appStarted && <PreventUnload />}
      {appStarted && <SavedToast toggle={toggleSavedToastRef} ms={5000} />}

      <ProcessViewer />

      <Row className="mt-2">
        {modelElements &&
          modelElements[0].map((process) => {
            return (
              <DataModelFormFields
                key={process.attributes.id}
                process={process}
                updateProcess={updateProcess}
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
export default connect(mapStateToProps, mapDispatchToProps)(DataModel);
