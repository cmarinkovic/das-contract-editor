//React
import React, { useRef, useState } from "react";
import { Link } from "@reach/router";

//Components
import { Button, Modal, Nav } from "react-bootstrap";

//Redux

//Styles

//Other
import PropTypes from "prop-types";

/**
 * Modal to prevent user from leaving page without saving.
 *
 * @component
 */
const SaveChangesModal = ({ context, toggleModalButtonRef, url, callback }) => {
  /**
   * Link reference hook to be used by parent component.
   * @constant
   *
   * @type {Object}
   */
  const linkRef = useRef();

  /**
   * Show modal state hook.
   * @constant
   *
   * @type {[boolean, function]}
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Hides modal on close.
   */
  const handleClose = () => setShowModal(false);

  /**
   * Handles show modal.
   */
  const handleShow = () => setShowModal(true);

  return (
    <div>
      {context === "navLink" && (
        <Nav.Link ref={linkRef} as={Link} to={url} hidden />
      )}

      <Button ref={toggleModalButtonRef} onClick={handleShow} hidden />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {context === "navLink" && "Are you sure to leave this page?"}
          {context === "replaceDiagram" &&
            "Are you sure to replace the current model?"}
          <br />
          Remember to save changes.
        </Modal.Body>
        <Modal.Footer>
          {context === "replaceDiagram" && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                callback();
                handleClose();
              }}
            >
              Yes
            </Button>
          )}

          {context === "navLink" && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                linkRef.current.click();
                handleClose();
              }}
            >
              Yes
            </Button>
          )}

          <Button variant="outline-primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

SaveChangesModal.propTypes = {
  /**
   * Context where modal is called.
   */
  context: PropTypes.string.isRequired,

  /**
   * Reference to toggle modal by parent component.
   */
  toggleModalButtonRef: PropTypes.object.isRequired,

  /**
   * URL to redirect to if user decides to leave current page.
   */
  url: PropTypes.string,

  /**
   * Callback function to execute if user attempts to replace the diagram.
   */
  callback: PropTypes.func,
};

export default SaveChangesModal;
