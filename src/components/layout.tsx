import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../routes/firebase";
import styled from "styled-components";
const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 5fr;
  padding: 30px 0px;
  width: 100%;
  height: 100%;
  max-width: 860px;
  overflow: hidden;
  margin-right: 10px;
`;

const Menu = styled.div`
  display: flex;
  position: fixed;
  width: 80px;
  height: 90vh;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  /* border-right: 1px solid rgba(255, 255, 255, 0.5); */
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 40px;
  }
  &.log-out {
    border-color: tomato;
    fill: tomato;
  }
`;

export default function Layout() {
  const navigate = useNavigate();

  const onLogOut = async () => {
    const ok = confirm("Are you sure you wan to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <>
      <Wrapper>
        <div>
          <Menu>
            <MenuItem>
              <Link to="/">
                <svg
                  fill="none"
                  strokeWidth={1.5}
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/profile">
                <svg
                  fill="white"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                  />
                </svg>
              </Link>
            </MenuItem>
            <MenuItem onClick={onLogOut} className="log-out">
              <svg
                fill=""
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                />
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                />
              </svg>
            </MenuItem>
          </Menu>
        </div>
        <Outlet />
      </Wrapper>
    </>
  );
}
