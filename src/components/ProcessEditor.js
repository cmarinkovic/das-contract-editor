//React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "@reach/router";

//Components
import PreventUnload from "./PreventUnload";
import SavedToast from "./SavedToast";
import SaveChangesModal from "./SaveChangesModal";

//Redux
import { connect } from "react-redux";
import {
  loadContract,
  setLoadContractError,
} from "../redux/Contracts/contracts-actions";

//Styles
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUndo,
  faRedo,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "react-resizable";

//Editor
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import lintModule from "bpmn-js-bpmnlint";
import bpmnlintConfig from "../bpmnlinter-config";
import minimapModule from "diagram-js-minimap";
import { useDropzone } from "react-dropzone";

//DasContract customization
import customModule from "../resources/customModule";
import dasContractDescriptor from "../resources/metamodel/dascontract.json";
import newDiagram from "../resources/newDiagram.dascontract";

//Other
import PropTypes from "prop-types";

/**
 * Enables to create and edit a contract process model. Changes can be saved.
 *
 * @component
 */
const ProcessEditor = ({
  appStarted,
  loadedContract,
  loadContract,
  loadContractError,
  setLoadContractError,
}) => {
  //Editor
  let moddle, modeling;

  /**
   * Process modeler object reference hook.
   * @constant
   *
   * @type {Object}
   */
  const modelerRef = useRef();

  /**
   * Process editor container HTML element reference hook.
   * @constant
   *
   * @type {Object}
   */
  const processEditorContainerRef = useRef();

  /**
   * Canvas HTML element for modeler reference hook.
   * @constant
   *
   * @type {Object}
   */
  const canvasRef = useRef();

  /**
   * Properties panel HTML element for modeler reference hook.
   * @constant
   *
   * @type {Object}
   */
  const propertiesPanelRef = useRef();

  /**
   * Command stack of modeler reference hook. Enables handling of undo/redo.
   * @constant
   *
   * @type {Object}
   */
  const commandStackRef = useRef();

  /**
   * Editor's taken columns state hook.
   * @constant
   *
   * @type {[number, function]}
   */
  const [editorSM, setEditorSM] = useState(12);

  /**
   * Resizable component height state hook.
   * @constant
   *
   * @type {[number, function]}
   */
  const [viewerHeight, setViewerHeight] = useState();

  /**
   * Updates the value of "viewerHeight" when user drags the corner of Resizable component.
   *
   * @param {{Object}} size Updated size of Resizable component.
   */
  const handleResize = ({ size }) => {
    setViewerHeight(size.height);
  };

  /**
   * Handles CTRL + Z and CTRL + SHIFT + Z with the command stack of the modeler.
   *
   * @param {Object} e Triggering event.
   */
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "Z" || e.key === "z")) {
      commandStackRef.current.redo();
    } else if (e.ctrlKey && (e.key === "Z" || e.key === "z")) {
      commandStackRef.current.undo();
    }
  };

  /**
   * Handles undo with the command stack of the modeler.
   */
  const handleUndo = () => {
    commandStackRef.current.undo();
  };

  /**
   * Handles redo with the command stack of the modeler.
   */
  const handleRedo = () => {
    commandStackRef.current.redo();
  };

  //File load
  /**
   * Import error indicator state hook.
   * @constant
   *
   * @type {[boolean, function]}
   */
  const [importError, setImportError] = useState(false);

  /**
   * Successful import indicator state hook.
   * @constant
   *
   * @type {[boolean, function]}
   */
  const [successfulImport, setSuccessfulImport] = useState(false);

  /**
   * Problem cause description state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [problemCause, setProblemCause] = useState();

  /**
   * Handles file drop. Displays a modal to confirm replacement of model.
   */
  const onDrop = () => {
    toggleModalButtonRef.current.click();
  };

  /**
   * Handles accepted file drop.
   */
  const onDropAccepted = () => {
    try {
      if (acceptedFiles) {
        const file = acceptedFiles[0];

        const reader = new FileReader();

        reader.onload = () => {
          const content = reader.result;

          loadContract({
            fileName: file.name,
            xml: content,
          });

          openDiagram(content);
        };

        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Error happened opening file: ", err);
    }
  };

  /**
   * Dropzone hook.
   */
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noClick: true,
    /*onDropAccepted: onDropAccepted,*/
    onDrop: onDrop,
  });

  /**
   * Attempts to open a diagram in XML with process modeler.
   *
   * @param {string} xml
   */
  const openDiagram = (xml) => {
    setEditorSM(12);

    modelerRef.current
      .importXML(xml)
      .then(() => {
        moddle = modelerRef.current.get("moddle");
        modeling = modelerRef.current.get("modeling");

        setEditorSM(9);
        setViewerHeight(processEditorContainerRef.current.clientHeight);

        commandStackRef.current = modelerRef.current.get("commandStack");

        loadedContract && setFileName(loadedContract.fileName);

        setSuccessfulImport(true);
        setLoadContractErrorResult(false);
      })
      .catch((err) => {
        setSuccessfulImport(false);
        setLoadContractErrorResult(true);
        setProblemCause(err.message);
      });
  };

  /**
   * Attempts to create a diagram in XML with process modeler.
   */
  const createNewDiagram = () => {
    try {
      let rawFile = new XMLHttpRequest();

      rawFile.open("GET", newDiagram, false);

      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status === 0) {
            loadContract({
              fileName: "newDiagram.dascontract",
              xml: rawFile.responseText,
            });

            openDiagram(rawFile.responseText);
          }
        }
      };

      rawFile.send(null);
    } catch (err) {
      console.error("Error happened opening model: ", err);
    }
  };

  /**
   * Sets load contract error both on reference hook and store.
   *
   * @param {boolean} result
   */
  const setLoadContractErrorResult = (result) => {
    setLoadContractError(result);
    setImportError(result);
  };

  useEffect(() => {
    modelerRef.current = new BpmnModeler({
      container: canvasRef.current,
      linting: {
        bpmnlint: bpmnlintConfig,
      },
      additionalModules: [
        customModule,
        propertiesPanelModule,
        lintModule,
        minimapModule,
      ],
      moddleExtensions: {
        dascontract: dasContractDescriptor,
      },
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
    });

    return () => {
      modelerRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (loadedContract) {
      openDiagram(loadedContract.xml);
    }
  }, [acceptedFiles, loadedContract]);

  //Model save
  /**
   * Toggle saved modal reference hook.
   * @constant
   *
   * @type {Object}
   */
  const toggleSavedToastRef = useRef(() => {});

  /**
   * Toggle save changes modal reference hook.
   * @constant
   *
   * @type {Object}
   */
  const toggleModalButtonRef = useRef();

  /**
   * File name state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [fileName, setFileName] = useState("");

  /**
   * Attempts to save the current state of the modeler as "loadedContract" in the store.
   */
  const saveModel = async () => {
    try {
      modelerRef.current.saveXML({ format: true }).then(({ xml }) => {
        loadContract({
          ...loadedContract,
          xml: xml,
        });

        toggleSavedToastRef.current();
      });
    } catch (err) {
      console.error("Error happened saving model: ", err);
    }
  };

  //File save
  /**
   * Link for SVG reference hook.
   * @constant
   *
   * @type {Object}
   */
  const linkSaveSVGRef = useRef();

  /**
   * Link for XML reference hook.
   * @constant
   *
   * @type {Object}
   */
  const linkSaveXMLRef = useRef();

  /**
   * Attempts to save the current XML from the state of the model.
   */
  const saveXML = async () => {
    try {
      await saveModel();
      await modelerRef.current.saveXML({ format: true }).then(({ xml }) => {
        encodeDownload(linkSaveXMLRef.current, loadedContract.fileName, xml);
        linkSaveXMLRef.current.click();
      });
    } catch (err) {
      console.error("Error happened saving XML: ", err);
    }
  };

  /**
   * Attempts to save the current SVG from the state of the model.
   */
  const saveSVG = async () => {
    try {
      await saveModel();
      await modelerRef.current.saveSVG().then(({ svg }) => {
        encodeDownload(
          linkSaveSVGRef.current,
          loadedContract.fileName + ".svg",
          svg
        );
        linkSaveSVGRef.current.click();
      });
    } catch (err) {
      console.error("Error happened saving SVG: ", err);
    }
  };

  /**
   * Encodes the download of files.
   *
   * @param {Object} link
   * @param {string} name
   * @param {*} data
   */
  const encodeDownload = (link, name, data) => {
    let encodedData = encodeURIComponent(data);

    if (data) {
      link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
      link.download = name;
    }
  };

  //Redirect
  const navigate = useNavigate();

  useEffect(() => {
    redirectIfNotReady();
  }, []);

  /**
   * Redirects the user to "Home" if there's no loaded contract or a load contract error.
   */
  const redirectIfNotReady = () => {
    if (!appStarted) {
      navigate("/");
    } else if (!loadedContract || loadContractError) {
      navigate("/process-editor");
    } else {
      //TODO: ??
    }
  };

  //TODO: Markup can be modified for react-bootstrap.
  return (
    <Container
      fluid={true}
      {...getRootProps({ className: "dropzone" })}
      onKeyDown={handleKeyDown}
    >
      <input {...getInputProps()} />

      {appStarted && <PreventUnload />}
      {appStarted && (
        <SavedToast
          toggle={toggleSavedToastRef}
          ms={5000}
          fileName={fileName}
        />
      )}
      {appStarted && (
        <SaveChangesModal
          context="replaceDiagram"
          toggleModalButtonRef={toggleModalButtonRef}
          callback={onDropAccepted}
        />
      )}

      <a ref={linkSaveXMLRef} className="hidden" target="_blank" />
      <a ref={linkSaveSVGRef} className="hidden" target="_blank" />

      <Resizable height={viewerHeight} onResize={handleResize}>
        <Row
          ref={processEditorContainerRef}
          className={`process-container ${importError && "with-import-error"} ${
            successfulImport && "with-diagram"
          }`}
          style={{ height: viewerHeight + "px" }}
        >
          <Col sm={editorSM}>
            <div className="message intro">
              <div className="px-4 py-5 my-5 text-center">
                <div className="col-lg-6 mx-auto">
                  <p className="lead mb-4 note">
                    Drop a DasContract file from your desktop or
                    <span
                      className="link-primary"
                      style={{ cursor: "pointer" }}
                      onClick={createNewDiagram}
                    >
                      {" "}
                      create a new model{" "}
                    </span>
                    to get started.
                  </p>
                </div>
              </div>
            </div>

            <div className="message import-error">
              <div className="px-4 py-5 my-5 text-center">
                <div className="col-lg-6 mx-auto">
                  <div className="lead mb-4 note">
                    <p>
                      Ooops, we could not display the DasContract model. Drop a
                      new file or{" "}
                      <span
                        className="link-primary"
                        style={{ cursor: "pointer" }}
                        onClick={createNewDiagram}
                      >
                        {" "}
                        create a new model{" "}
                      </span>
                      to get started.
                    </p>
                  </div>

                  <div
                    className={`${!problemCause && "d-none"} lead mb-4 note`}
                  >
                    <span>Cause of the problem: </span>
                    <pre>{problemCause}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={canvasRef}
              className="canvas"
              style={{ height: viewerHeight + "px" }}
            />
          </Col>

          <Col
            className={`${(!successfulImport || importError) && "d-none"}`}
            sm="3"
          >
            <div
              ref={propertiesPanelRef}
              id="properties-panel"
              className="properties-panel-parent"
              style={{ height: viewerHeight + "px" }}
            />
          </Col>
        </Row>
      </Resizable>

      <ButtonGroup
        className={`${
          (!successfulImport || importError) && "d-none"
        } save-buttons m-2`}
      >
        <Button variant="outline-secondary" size="m" onClick={saveModel}>
          <FontAwesomeIcon icon={faSave} />
        </Button>
        <Button variant="outline-secondary" size="m" onClick={saveXML}>
          <FontAwesomeIcon icon={faDownload} /> XML
        </Button>
        <Button variant="outline-secondary" size="m" onClick={saveSVG}>
          <FontAwesomeIcon icon={faDownload} /> SVG
        </Button>
        <Button variant="outline-secondary" size="m" onClick={handleUndo}>
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button variant="outline-secondary" size="m" onClick={handleRedo}>
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </ButtonGroup>
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
    setLoadContractError: (isError) => dispatch(setLoadContractError(isError)),
  };
};

ProcessEditor.propTypes = {
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

  /**
   * Action to set load contract error indicator in the store.
   */
  setLoadContractError: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessEditor);
