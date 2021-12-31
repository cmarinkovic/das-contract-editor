//React
import React, {useRef, useState} from "react";
import {Link} from "@reach/router";

//Components
import {Button, Modal, Nav} from "react-bootstrap";

//Redux

//Styles

//Other


const SaveChangesModal = ({context, toggleModalButtonRef, url, callback}) => {
    const linkRef = useRef();

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    return (
        <div>
            {context === "navLink" && <Nav.Link ref={linkRef} as={Link} to={url} hidden/>}

            <Button ref={toggleModalButtonRef} onClick={handleShow} hidden/>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {context === "navLink" && "Are you sure to leave this page?"}
                    {context === "replaceDiagram" && "Are you sure to replace the current model?"}
                    <br/>
                    Remember to save changes.
                </Modal.Body>
                <Modal.Footer>
                    {context === "replaceDiagram" && (
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                callback();
                                handleClose();
                            }
                            }>
                            Yes
                        </Button>
                    )
                    }

                    {context === "navLink" && (
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                linkRef.current.click();
                                handleClose();
                            }
                            }>
                            Yes
                        </Button>
                    )
                    }

                    <Button
                        variant="outline-primary"
                        onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default SaveChangesModal;
