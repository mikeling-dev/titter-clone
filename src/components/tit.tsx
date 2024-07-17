import styled from "styled-components";
import { ITit } from "./timeline";
import { auth, db, storage } from "../routes/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  /* border-left: 0px;
  border-right: 0px; */
  margin: 10px 0px;
  margin-right: 8px;
`;

const Column = styled.div`
  display: grid;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ProfilePic = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background-color: gray;
`;

const TempPic = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  background-color: gray;
  border-radius: 15px;
  svg {
    height: 28px;
    width: 28px;
  }
`;

const Username = styled.span`
  font-family: 800;
  font-size: 18px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  margin-right: 10px;
  max-width: 300px;
  font-size: 18px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const EditInput = styled.textarea`
  background-color: black;
  border: 1px dotted gray;
  border-radius: 5px;
  width: 280px;
  height: 60px;
  font: 18px;
  resize: none;
  color: white;
  &:focus {
    outline: none;
    border: 1px solid #1d9bf0;
  }
`;

const Photo = styled.img`
  height: auto;
  width: 150px;
  border-radius: 15px;
  border: 0px;
`;

const PhotoWrapper = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
  width: 150px;
`;

const Watermark = styled.div`
  width: 50px;
  display: flex;
  position: absolute;
  top: 0;
  left: 5px;
  fill: #1a1a1a;
  opacity: 0.5;
`;

const BtnArea = styled.div`
  display: flex;
  gap: 10px;
`;

const TitBtn = styled.div`
  fill: gray;
  height: 20px;
  width: 20px;
  margin-top: 15px;
  cursor: pointer;
  &[id="delete"] {
    :hover {
      opacity: 0.8;
      fill: tomato;
    }
  }
  &[id="edit"] {
    :hover {
      opacity: 0.8;
      fill: #1d9bf0;
    }
  }
  &[id="edited"] {
    :hover {
      opacity: 0.8;
      fill: green;
    }
  }
`;
export default function Tit({
  userId,
  username,
  tit,
  photo,
  id,
  profilePic,
}: ITit) {
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [editedTit, setEditedTit] = useState(tit);
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);
  const onDelete = async () => {
    const ok = confirm("Are you sure about deleting this tit?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tits", id));
      if (photo) {
        const photoRef = ref(storage, `tits/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onEdit = () => {
    if (editing) return;
    setEditedTit(tit);
    setEditing(true);
  };

  const onEdited = async () => {
    // const user = auth.currentUser;
    const ok = confirm("Are you sure you want to update your tit?");
    if (!ok) {
      setEditing(false);
      return;
    }
    try {
      await updateDoc(doc(db, "tits", id), { tit: editedTit });
      if (editedPhoto) {
        const photoRef = ref(storage, `tits/${user?.uid}/${id}`);
        const uploaded = await uploadBytes(photoRef, editedPhoto);
        const newUrl = await getDownloadURL(uploaded.ref);
        await updateDoc(doc(db, "tits", id), {
          photo: newUrl,
        });
      }
      setEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTit(e.target.value);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setEditedPhoto(files[0]);
    }
  };
  return (
    <Wrapper>
      <Column>
        <UserInfo>
          {profilePic ? (
            <ProfilePic src={profilePic} />
          ) : (
            <TempPic>
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
            </TempPic>
          )}
          <Username>{username}</Username>
        </UserInfo>
        {editing ? (
          <EditInput value={editedTit} onChange={onChange} />
        ) : (
          <Payload>{tit}</Payload>
        )}

        {userId !== user?.uid ? null : (
          <BtnArea>
            <TitBtn id="delete" onClick={onDelete}>
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                />
              </svg>
            </TitBtn>
            {editing ? (
              <TitBtn id="edited" onClick={onEdited}>
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
              </TitBtn>
            ) : (
              <TitBtn id="edit" onClick={onEdit}>
                <svg
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                </svg>
              </TitBtn>
            )}
            {editing && !photo ? (
              <TitBtn
                onClick={() => document.getElementById("newphoto")?.click()}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2.5 5A1.5 1.5 0 0 0 1 6.5v5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 5h-.879a1.5 1.5 0 0 1-1.06-.44l-1.122-1.12A1.5 1.5 0 0 0 9.38 3H6.62a1.5 1.5 0 0 0-1.06.44L4.439 4.56A1.5 1.5 0 0 1 3.38 5H2.5ZM11 8.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <input
                  id="newphoto"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onPhotoChange}
                />
              </TitBtn>
            ) : null}
          </BtnArea>
        )}
      </Column>
      <Column>
        {photo ? (
          editing ? (
            <PhotoWrapper
              onClick={() => document.getElementById("newphoto")?.click()}
            >
              <Photo src={photo} />
              <Watermark>
                <svg
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                </svg>
              </Watermark>
              <input
                id="newphoto"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onPhotoChange}
              />
            </PhotoWrapper>
          ) : (
            <Photo src={photo} />
          )
        ) : (
          ""
        )}
      </Column>
    </Wrapper>
  );
}
