import styled from "styled-components";
import { auth, db, storage } from "./firebase";
import React, { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ITit } from "../components/timeline";
import Tit from "../components/tit";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: scroll;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  height: 80px;
  width: 80px;
  overflow: hidden;
  background-color: gray;
  border-radius: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 70px;
    width: 70px;
  }
`;

const AvatarImg = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 40px;
  overflow: hidden;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameSection = styled.div`
  display: flex;
  align-items: end;
`;

const Name = styled.span`
  font-size: 22px;
`;

const EditName = styled.textarea`
  font-size: 18px;
  height: 30px;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  outline: none;
  resize: none;
  background-color: black;
`;

const EditBtn = styled.button`
  border: none;
  background-color: black;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  svg {
    fill: white;
    height: 16px;
  }
`;

const Tits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
  scrollbar-width: 0;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(
    user?.displayName ?? "Anonymous"
  );
  const [tits, setTits] = useState<ITit[]>([]);
  const [avatar, setAvatar] = useState(user?.photoURL);

  const onEditName = () => {
    setEditing(true);
  };

  const onEditNameDone = async () => {
    const ok = confirm(`Confirm changing your name to ${editedName}?`);
    if (!ok || !user) {
      setEditing(false);
      return;
    }
    try {
      await updateProfile(user, { displayName: editedName });
      const snapshot = await getDocs(titsQuery);
      const updatePromise = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { username: editedName })
      );
      Promise.all(updatePromise);
      await updateDoc(doc(db, "tit"), {});
    } catch {
    } finally {
      setEditing(false);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedName(e.target.value);
  };

  const titsQuery = useMemo(() => {
    return query(
      collection(db, "tits"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );
  }, []);
  //   const fileSize = file.size /1000 /1024
  //   const [file, setFile] = useState<File || null>(null)
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user.uid}`);
      const uploadedPhoto = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(uploadedPhoto.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });

      const snapshot = await getDocs(titsQuery);
      const updatePromises = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { profilePic: avatarUrl })
      );
      await Promise.all(updatePromises);
    }
  };

  const fetchTits = async () => {
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

  useEffect(() => {
    fetchTits();
  }, []);

  return (
    <Wrapper>
      <ProfileInfo>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              fill="black"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
              />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          id="avatar"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
        <NameSection>
          {editing ? (
            <EditName value={editedName} onChange={onNameChange} />
          ) : (
            <Name>{user?.displayName ?? "Tit user"}</Name>
          )}
          {editing ? (
            <EditBtn onClick={onEditNameDone}>
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                />
              </svg>
            </EditBtn>
          ) : (
            <EditBtn onClick={onEditName}>
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
              </svg>
            </EditBtn>
          )}
        </NameSection>
      </ProfileInfo>
      <Tits>
        {tits.map((tit) => (
          <Tit key={tit.id} {...tit} />
        ))}
      </Tits>
    </Wrapper>
  );
}
