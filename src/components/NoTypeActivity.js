//React

//Components

//Redux

//Styles
import { Accordion, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

//Other
import PropTypes from "prop-types";

/**
 * Activity of no type.
 *
 * @component
 */
const NoTypeActivity = ({ task }) => {
  return (
    <Col sm="4">
      <Accordion className="accordion-inline">
        <Accordion.Item eventKey={`${task.attributes && task.attributes.id}`}>
          <Accordion.Header>
            <FontAwesomeIcon className="mx-2" icon={faQuestion} />
            {task.attributes && task.attributes.name} (
            {task.attributes && task.attributes.id})
          </Accordion.Header>
          <Accordion.Body>Please assign a task type.</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

NoTypeActivity.propTypes = {
  /**
   * Task data.
   */
  task: PropTypes.object.isRequired,
};

export default NoTypeActivity;
