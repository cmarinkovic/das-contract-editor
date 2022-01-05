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

const BusinessRuleActivity = ({ task, updateTask }) => {
  //Activity das contract properties data
  const [dmnXML, setDmnXML] = useState();

  useEffect(() => {
    if (task.attributes["dascontract:activity-properties"]) {
      const xmlModel = convert.json2xml(
        JSON.parse(task.attributes["dascontract:activity-properties"]),
        {
          compact: false,
          spaces: 4,
        }
      );

      setDmnXML(xmlModel);
    }
  }, []);

  //DMN editor
  const dmnModelerRef = useRef();
  const canvasRef = useRef();
  const commandStackRef = useRef();

  const [viewerHeight, setViewerHeight] = useState(1000); // *0.5 at inline style to reduce resizing speed.
  const handleResize = (event, { element, size, handle }) => {
    setViewerHeight(size.height);
  };

  const [importError, setImportError] = useState(false);
  const [successfulImport, setSuccessfulImport] = useState(false);

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
  const [problemCause, setProblemCause] = useState();

  const onDrop = () => {
    toggleModalButtonRef.current.click();
  };

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noClick: true,
    /*onDropAccepted: onDropAccepted,*/
    onDrop: onDrop,
  });

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
  const [fileName, setFileName] = useState("");
  const toggleModalButtonRef = useRef();

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
  const linkSaveSVGRef = useRef();
  const linkSaveXMLRef = useRef();

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

export default BusinessRuleActivity;
