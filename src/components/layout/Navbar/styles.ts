import styled from 'styled-components';

export const Container = styled.nav`
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 1200px;
  height: 50px;
  transition: 0.3s ease-in-out;
  z-index: 9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;

export const NavLinks = styled.div`
  width: 1200px;
  margin: 0 auto;
  height: 50px;
  display: flex;

  a {
    position: relative;
    height: 50px;
    line-height: 50px;
    text-transform: uppercase;
    flex: 1;
    text-align: center;
    font-size: 16px;

    span {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      height: 1px;
      width: 0;
      background: #a4bfd1;
      transition: 0.3s ease-in-out;
    }

    &:hover span {
      width: 100%;
    }

    &:after {
      content: '';
      position: absolute;
      height: 1px;
      width: 6px;
      top: 24px;
      right: -3px;
      background: #566b7a;
    }

    &:last-of-type {
      &:after {
        display: none;
      }
    }
  }
`;
