import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export default ({ to, text }) => {
  // const isActive = () => {
  //   const url = window.location.href
  //   return url.substr(url.lastIndexOf('/') + 1) === to
  // }

  return <StyledLink to={to}>{text}</StyledLink>
}

const StyledLink = styled(NavLink)`
  border: 1px solid;
  border-color: white;
  height: 2rem;
  width: 6rem;
  border-radius: 0.2rem;
  align-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  font-family: HelveticaNeu sans;
  color: white;
  text-decoration: none;
`
