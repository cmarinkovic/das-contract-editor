//React
import React, { useRef, useState } from "react";
import { Link } from "@reach/router";

//Components
import SaveChangesModal from "./SaveChangesModal";

//Redux
import { connect } from "react-redux";

//Styles
import { Nav, Navbar } from "react-bootstrap";

//Other

const NavItems = ({ loadedContract }) => {
  const toggleModalButtonRef = useRef();
  const [url, setUrl] = useState("#");

  return (
    <>
      <SaveChangesModal
        context="navLink"
        toggleModalButtonRef={toggleModalButtonRef}
        url={url}
      />

      <Navbar.Collapse id="basic-navbar-nav">
        {loadedContract ? (
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                setUrl("/");
                toggleModalButtonRef.current.click();
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="process-editor"
              onClick={(e) => {
                e.preventDefault();
                setUrl("process-editor");
                toggleModalButtonRef.current.click();
              }}
            >
              Process editor
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="activity-properties"
              onClick={(e) => {
                e.preventDefault();
                setUrl("activity-properties");
                toggleModalButtonRef.current.click();
              }}
            >
              Activity properties
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="data-model"
              onClick={(e) => {
                e.preventDefault();
                setUrl("data-model");
                toggleModalButtonRef.current.click();
              }}
            >
              Data model
            </Nav.Link>
          </Nav>
        ) : (
          <Nav className="me-auto">
            <Link to="/">
              <Nav.Link>Home</Nav.Link>
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    loadedContract: state.contracts.loadedContract,
  };
};
export default connect(mapStateToProps)(NavItems);
