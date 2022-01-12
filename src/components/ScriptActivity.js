//React
import React, { useEffect, useState } from "react";

//Components

//Redux

//Styles
import { Accordion, Button, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faScroll } from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "react-resizable";

//Code editor
import CodeMirror from "@uiw/react-codemirror";

//Other
import PropTypes from "prop-types";

/**
 * Script activity. It provides a code editor to add a script.
 *
 * @component
 */
const ScriptActivity = ({ task, updateTask }) => {
  /**
   * Script state hook.
   * @constant
   *
   * @type {[string, function]}
   */
  const [script, setScript] = useState("");

  useEffect(() => {
    task.attributes["dascontract:activity-properties"] &&
      setScript(task.attributes["dascontract:activity-properties"]);
  }, []);

  /**
   * Resizable height component state hook.
   * @constant
   *
   * @type {[number, function]}
   */
  const [viewerHeight, setViewerHeight] = useState(400);

  /**
   * Updates the value of "viewerHeight" when user drags the corner of Resizable component.
   *
   * @param {{Object}} size Updated size of Resizable component.
   */
  const handleResize = ({ size }) => {
    setViewerHeight(size.height);
  };

  return (
    <Col sm="4">
      <Accordion className="accordion-inline">
        <Accordion.Item eventKey={`${task.attributes && task.attributes.id}`}>
          <Accordion.Header>
            <FontAwesomeIcon className="mx-2" icon={faScroll} />
            {task.attributes && task.attributes.name} (
            {task.attributes && task.attributes.id})
          </Accordion.Header>
          <Accordion.Body>
            <Resizable height={viewerHeight} onResize={handleResize}>
              <Container
                className="m-2"
                fluid={true}
                style={{ height: viewerHeight * 0.5 + "px" }}
              >
                <CodeMirror
                  height={viewerHeight * 0.5 + "px"}
                  value={script}
                  options={{ lint: true }}
                  onChange={(value, viewUpdate) => {
                    setScript(value);
                  }}
                />
              </Container>
            </Resizable>
            <Button
              variant="outline-primary"
              size="m"
              onClick={() => updateTask(task, script)}
            >
              <FontAwesomeIcon icon={faSave} />
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

ScriptActivity.propTypes = {
  /**
   * Task data.
   */
  task: PropTypes.object.isRequired,

  /**
   * Callback to update the value of task in the parent component.
   */
  updateTask: PropTypes.func.isRequired,
};

export default ScriptActivity;
