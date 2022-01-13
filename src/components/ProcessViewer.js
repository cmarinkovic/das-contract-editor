//React
import React, { useEffect, useRef, useState } from "react";

//Components

//Redux
import { connect } from "react-redux";

//Styles
import { Col, Container, Row } from "react-bootstrap";
import { Resizable } from "react-resizable";

//Viewer
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import minimapModule from "diagram-js-minimap";
import bpmnlintConfig from "../bpmnlinter-config";

//DasContract customization
import customViewerModule from "../resources/customViewerModule";
import dasContractDescriptor from "../resources/metamodel/dascontract.json";

//Other
import PropTypes from "prop-types";

/**
 * Displays the loaded contract process model. Changes are not saved.
 *
 * @component
 */
const ProcessViewer = ({ loadedContract, defaultViewerHeight }) => {
  //Viewer
  let moddle, modeling;

  /**
   * Process modeler object reference hook.
   * @constant
   *
   * @type {Object}
   */
  const modelerRef = useRef();

  /**
   * Process viewer container HTML element reference hook.
   * @constant
   *
   * @type {Object}
   */
  const processViewerContainerRef = useRef();

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
  const [viewerHeight, setViewerHeight] = useState(defaultViewerHeight);

  /**
   * Updates the value of "viewerHeight" when user drags the corner of Resizable component.
   *
   * @param {Object} event Triggered event.
   * @param {{Object}} size Updated size of Resizable component.
   */
  const handleResize = (event, { size }) => {
    setViewerHeight(size.height);
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
        setViewerHeight(processViewerContainerRef.current.clientHeight);

        setSuccessfulImport(true);
        setImportError(false);
      })
      .catch((err) => {
        setSuccessfulImport(false);
        setImportError(true);
        setProblemCause(err.message);
      });
  };

  useEffect(() => {
    modelerRef.current = new BpmnModeler({
      container: canvasRef.current,
      linting: {
        bpmnlint: bpmnlintConfig,
      },
      additionalModules: [
        customViewerModule,
        propertiesPanelModule,
        minimapModule,
      ],
      moddleExtensions: {
        dascontract: dasContractDescriptor,
      },
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
    });

    if (loadedContract) {
      openDiagram(loadedContract.xml);
    }

    return () => {
      modelerRef.current.destroy();
    };
  }, [successfulImport, importError]);

  useEffect(() => {
    if (loadedContract) {
      openDiagram(loadedContract.xml);
    }
  }, [loadedContract]);

  //TODO: Markup can be modified for react-bootstrap.
  return (
    <Container fluid={true}>
      <Resizable height={viewerHeight} onResize={handleResize}>
        <Row
          ref={processViewerContainerRef}
          className={`viewer-process-container ${
            importError && "with-import-error"
          } ${successfulImport && "with-diagram"}`}
          style={{ height: viewerHeight + "px" }}
        >
          <Col sm={editorSM}>
            <div className="message import-error">
              <div className="px-4 py-5 my-5 text-center">
                <div className="col-lg-6 mx-auto">
                  <p className="lead mb-4 note">
                    Ooops, we could not display the DasContract model.
                  </p>
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
              className="viewer-canvas"
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
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loadedContract: state.contracts.loadedContract,
  };
};

ProcessViewer.propTypes = {
  /**
   * Loaded contract from store.
   */
  loadedContract: PropTypes.object,

  /**
   * App started indicator from store.
   */
  defaultViewerHeight: PropTypes.number,
};

export default connect(mapStateToProps)(ProcessViewer);
