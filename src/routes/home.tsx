import styled from "styled-components";
import PostTitForm from "../components/post-tit-form";
import TimeLine from "../components/timeline";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  width: auto;

  grid-template-rows: 1fr 4fr;
  overflow-y: scroll;
  scrollbar-width: 0;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTitForm />
      <div></div>
      <TimeLine />
    </Wrapper>
  );
}
