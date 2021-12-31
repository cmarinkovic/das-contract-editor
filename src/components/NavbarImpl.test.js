//React

//Components
import NavItems from "./NavItems";

//Redux

//Styles
import {Container, Navbar} from "react-bootstrap";

//Other


const NavbarImpl = () => {
    return (
        <Navbar id="nav" bg="light" expand="lg">
            <Container>
                <Navbar.Brand>Das Contract Editor</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <NavItems />
            </Container>
        </Navbar>
    );
}

export default NavbarImpl;
