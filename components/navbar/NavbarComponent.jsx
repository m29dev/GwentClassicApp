import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Character from '../character/Character'
import './navbar.css'

const NavbarComponent = () => {
    return (
        <>
            <div className="navbar-box">
                <Navbar.Brand>
                    <Character
                        character="GameCenter"
                        theme="gray"
                        fontSize="20"
                    ></Character>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>Home</Nav.Link>
                        <Nav.Link>Link</Nav.Link>

                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item>Leave room</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </>
    )
}

export default NavbarComponent
