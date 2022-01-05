//React
import React from "react";

//Components
import NavItems from "./NavItems";

//Redux

//Styles
import { Container, Navbar } from "react-bootstrap";

//Other

/**
 * Navbar wrapper. "NavbarImpl" is used to avoid confict with react-bootstrap component.
 * @component
 */
const NavbarImpl = () => {
  return (
    <Navbar id="nav" bg="light" expand="lg">
      <Container>
        <Navbar.Brand>DasContract Editor</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <NavItems />
      </Container>
    </Navbar>
  );
};

export default NavbarImpl;
