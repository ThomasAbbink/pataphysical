import React, { Component } from "react";
import NavBarItem from "./NavBarItem";
import styled from "styled-components";

export default class NavBar extends Component {
  render() {
    return (
      <Container>
        <Ul>
          <NavBarItem text="Cube" to="4dcube" />
          <NavBarItem text="Cardioid" to="cardioid" />
        </Ul>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 8rem;
  background-color: palevioletred;
`;

const Ul = styled.ul`
  display: "flex";
  flex-direction: "column";
  align-items: "left";
  align-content: "center";
  width: "100%";
  padding: "1rem";
  height: "100vh";
`;
