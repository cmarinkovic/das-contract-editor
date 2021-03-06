//React
import React, { useEffect, useRef, useState } from "react";

//Components
import SaveChangesModal from "./SaveChangesModal";

//Redux

//Styles
import { Accordion, Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faRedo,
  faSave,
  faTable,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "react-resizable";

//DMN editor
import DmnModeler from "dmn-js/lib/Modeler";
import { DrdLinting } from "dmn-js-dmnlint";
import dmnlintConfig from "../.dmnlintrc";
import { useDropzone } from "react-dropzone";
import newDmn from "../resources/newDmn.dmn";

//Other
import convert from "xml-js";
import PropTypes from "prop-types";

/**
 * Business rule activity. It provides a DMN editor.
 *
 * @component
 */
const BusinessRuleActivity = ({ task, updateTask }) => {
  /**
   * DMN XML state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [dmnXML, setDmnXML] = useState();

  useEffect(() => {
    if (task.attributes["dascontract:activity-properties"]) {
      let xmlModel;

      try {
        xmlModel = convert.json2xml(
          JSON.parse(task.attributes["dascontract:activity-properties"]),
          {
            compact: false,
            spaces: 4,
          }
        );
        setDmnXML(xmlModel);
      } catch (e) {}
    }
  }, []);

  //DMN editor
  /**
   * DMN modeler reference hook.
   * @constant
   *
   * @type {Object}
   */
  const dmnModelerRef = useRef();

  /**
   * Canvas HTML element for DMN modeler reference hook.
   * @constant
   *
   * @type {Object}
   */
  const canvasRef = useRef();

  /**
   * Command stack of modeler reference hook. Enables handling of undo/redo.
   * @constant
   *
   * @type {Object}
   */
  const commandStackRef = useRef();

  /**
   * Resizable component height state hook.
   * @constant
   *
   * @type {[number, function]}
   */
  const [viewerHeight, setViewerHeight] = useState(1000); // *0.5 at inline style to reduce resizing speed.

  /**
   * Updates the value of "viewerHeight" when user drags the corner of Resizable component.
   *
   * @param {Object} event Triggered event.
   * @param {{Object}} size Updated size of Resizable component.
   */
  const handleResize = (event, { size }) => {
    setViewerHeight(size.height);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "Z" || e.key === "z")) {
      commandStackRef.current.redo();
    } else if (e.ctrlKey && (e.key === "Z" || e.key === "z")) {
      commandStackRef.current.undo();
    }
  };

  const handleUndo = () => {
    commandStackRef.current.undo();
  };

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

          setFileName(file.name);
          setDmnXML(content);

          openDmn(content);
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
   * Attempts to open a diagram in XML with DMN modeler.
   *
   * @param {string} dmnXML
   */
  const openDmn = async (dmnXML) => {
    await dmnModelerRef.current
      .importXML(dmnXML)
      .then(({ warnings }) => {
        if (warnings.length) {
          console.log("Import with warnings: ", warnings);
        } else {
          console.log("Import successful.");
        }

        /*commandStackRef.current = dmnModelerRef.current.get("commandStack");*/

        setSuccessfulImport(true);
        setImportError(false);
      })
      .catch((err) => {
        setSuccessfulImport(false);
        setImportError(true);
        setProblemCause(err.message);
      });
  };

  /**
   * Attempts to create a diagram in XML with DMN modeler.
   */
  const createNewDmn = () => {
    try {
      let rawFile = new XMLHttpRequest();

      rawFile.open("GET", newDmn, false);

      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
            setFileName("newDmn.dmn");
            setDmnXML(rawFile.responseText);
            openDmn(rawFile.responseText);
          }
        }
      };

      rawFile.send(null);
    } catch (err) {
      console.error("Error happened opening model: ", err);
    }
  };

  useEffect(() => {
    if (!dmnModelerRef.current) {
      dmnModelerRef.current = new DmnModeler({
        container: canvasRef.current,
        width: "100%",
        common: {
          linting: dmnlintConfig,
        },
        drd: {
          additionalModules: [DrdLinting],
        },
      });
    }
  }, []);

  useEffect(() => {
    if (dmnXML) {
      openDmn(dmnXML);
    }
  }, [acceptedFiles, dmnXML]);

  //Model save
  /**
   * Toggle saved modal reference hook.
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
      dmnModelerRef.current.saveXML().then(({ xml }) => {
        const jsonModel = JSON.stringify(
          convert.xml2json(xml, {
            compact: false,
            spaces: 4,
          })
        );

        updateTask(task, jsonModel);
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
   * Attempts to save the current XML from task attributes.
   */
  const saveXML = async () => {
    try {
      saveModel();
      await dmnModelerRef.current.saveXML({ format: true }).then(({ xml }) => {
        encodeDownload(
          linkSaveXMLRef.current,
          `${task.attributes.id}.dmn`,
          xml
        );
        linkSaveXMLRef.current.click();
      });
    } catch (err) {
      console.error("Error happened saving XML: ", err);
    }
  };

  /**
   * Attempts to save the current SVG from task attributes.
   */
  const saveSVG = async () => {
    try {
      saveModel();
      await dmnModelerRef.current.saveSVG().then(({ svg }) => {
        encodeDownload(
          linkSaveSVGRef.current,
          `${task.attributes.id}.dmn.svg`,
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

  //TODO: Markup can be modified for react-bootstrap.
  return (
    <Col
      sm="12"
      {...getRootProps({ className: "dropzone" })}
      /*onKeyDown={handleKeyDown}*/
    >
      <input {...getInputProps()} />

      <SaveChangesModal
        context="replaceDiagram"
        toggleModalButtonRef={toggleModalButtonRef}
        callback={onDropAccepted}
      />

      <a ref={linkSaveXMLRef} className="hidden" target="_blank" />
      <a ref={linkSaveSVGRef} className="hidden" target="_blank" />

      <Accordion className="accordion-inline">
        <Accordion.Item eventKey={`${task.attributes && task.attributes.id}`}>
          <Accordion.Header>
            <FontAwesomeIcon className="mx-2" icon={faTable} />
            {task.attributes && task.attributes.name} (
            {task.attributes && task.attributes.id})
          </Accordion.Header>

          <Accordion.Body>
            <Resizable height={viewerHeight} onResize={handleResize}>
              <Row
                className={`dmn-container ${
                  importError && "with-import-error"
                } ${successfulImport && "with-diagram"} mb-2`}
                style={{ height: viewerHeight * 0.5 + "px" }}
              >
                <Col>
                  <div className="message intro">
                    <div className="px-4 py-5 my-5 text-center">
                      <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4 note">
                          Drop a DMN file from your desktop or
                          <span
                            className="link-primary"
                            style={{ cursor: "pointer" }}
                            onClick={createNewDmn}
                          >
                            {" "}
                            create a new DMN model{" "}
                          </span>
                          to get started.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="message import-error">
                    <div className="px-4 py-5 my-5 text-center">
                      <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4 note">
                          Ooops, we could not display the DMN model. Drop
                          another file or{" "}
                          <span
                            className="link-primary"
                            style={{ cursor: "pointer" }}
                            onClick={createNewDmn}
                          >
                            {" "}
                            create a new DMN model
                          </span>
                          .
                        </p>
                        <div
                          className={`${
                            !problemCause && "d-none"
                          } lead mb-4 note`}
                        >
                          <span>Cause of the problem: </span>
                          <pre>{problemCause}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={canvasRef}
                    className="dmn-canvas"
                    style={{ height: viewerHeight * 0.5 + "px" }}
                  />
                </Col>
              </Row>
            </Resizable>

            <ButtonGroup
              className={`${
                (!successfulImport || importError) && "d-none"
              } dmn-save-buttons m-2`}
            >
              <Button variant="outline-primary" size="m" onClick={saveModel}>
                <FontAwesomeIcon icon={faSave} />
              </Button>
              <Button variant="outline-primary" size="m" onClick={saveXML}>
                <FontAwesomeIcon icon={faDownload} /> XML
              </Button>
              {/*<Button
                                    variant="outline-secondary"
                                    size="m" onClick={saveSVG}>
                                    <FontAwesomeIcon icon={faDownload}/> SVG
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="m" onClick={handleUndo}>
                                    <FontAwesomeIcon icon={faUndo}/>
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="m" onClick={handleRedo}>
                                    <FontAwesomeIcon icon={faRedo}/>
                                </Button>*/}
            </ButtonGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

BusinessRuleActivity.propTypes = {
  /**
   * Task data.
   */
  task: PropTypes.object.isRequired,

  /**
   * Callback to update the value of task in the parent component.
   */
  updateTask: PropTypes.func.isRequired,
};

export default BusinessRuleActivity;
