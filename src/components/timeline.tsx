import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../routes/firebase";
import Tit from "./tit";

export interface ITit {
  id: string;
  createdAt: number;
  photo?: string;
  tit: string;
  userId: string;
  username: string;
  profilePic: string;
}

const Wrapper = styled.div`
  margin-top: 30px;

  height: 80%;
  overflow-y: scroll;
  scrollbar-width: 0px;
`;

export default function TimeLine() {
  const [tits, setTits] = useState<ITit[]>([]);

  useEffect(() => {
    const FetchTit = () => {
      const titsQuery = query(
        collection(db, "tits"),
        orderBy("createdAt", "desc"),
        limit(30)
      );
      // const spanshot = await getDocs(titsQuery);
      // const tits = spanshot.docs.map((doc) => {
      //   const { tit, photo, createdAt, userId, username } = doc.data();
      //   return {
      //     tit,
      //     photo,
      //     createdAt,
      //     userId,
      //     username,
      //     id: doc.id,
      //   };
      // });

      return onSnapshot(titsQuery, (snapshot) => {
        const tits = snapshot.docs.map((doc) => {
          const { tit, photo, createdAt, userId, username, profilePic } =
            doc.data();
          return {
            tit,
            photo,
            createdAt,
            userId,
            username,
            id: doc.id,
            profilePic,
          };
        });
        setTits(tits);
      });
    };
    const unsubscribe = FetchTit();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tits.map((tit) => (
        <Tit key={tit.id} {...tit} />
      ))}
    </Wrapper>
  );
}
