import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Header.css";

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary"  >
      <Container fluid>
        <Navbar.Brand href="#">SellerKin</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;

