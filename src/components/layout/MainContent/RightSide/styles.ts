import styled from 'styled-components';

export const Container = styled.aside`
  position: relative;
  width: 270px;
  background: url('/images/layout/sidebar-bg.jpg');
  margin: 80px 0 80px 0;

  &:before {
    content: '';
    position: absolute;
    pointer-events: none;
    width: 25px;
    height: 25px;
    background: url('/images/layout/corner-icon-small-right-top.png');
    top: -4px;
    right: -4px;
  }

  &:after {
    content: '';
    position: absolute;
    pointer-events: none;
    width: 25px;
    height: 25px;
    background: url('/images/layout/corner-icon-small-right.png');
    bottom: -4px;
    right: -4px;
  }
`;
