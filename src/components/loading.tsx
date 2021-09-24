import styled from "@emotion/styled";

const Loading = styled.p`
  color: #fba300;
  font-size: 2rem;
  margin: 2rem auto;
`;

Loading.defaultProps = {
  children: "Loading...",
};

export default Loading;
