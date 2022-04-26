import { Navbar } from "react-bulma-components";
import Image from "next/image";
import Brand from "./../assets/brand-logo.png";
import { useState } from "react";

export default function NavBar() {

  const [active, setActive] = useState(false);
  const toggle = () => setActive((state) => !state);

  return (
    <Navbar active={active}>
      <Navbar.Brand>
        <Navbar.Item href="/">
          <Image src={Brand} alt="Plataforma financeira" />
        </Navbar.Item>
        <Navbar.Burger onClick={toggle}/>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item href="/companhias">Companhias</Navbar.Item>
          <Navbar.Item href="/demonstrativos">Demonstrativos</Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}