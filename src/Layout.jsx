import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
`;

export default function Layout() {
  return (
    <Wrapper>
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}