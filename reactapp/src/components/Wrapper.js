import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  padding-top: 50px;
  overflow-x: hidden;
  background: ${props => props.vizColor};

  /* Flexbox for layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  #defaultCanvas0 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  svg {
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 100;
    margin-top: -40px;
  }

  #white-bg-buttons {
    fill: #19ca90;
  }

  /* Optional: Make sure the body takes up full height and width as well */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`;

export default Wrapper;
