import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../routes/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  /* height: 120px; */
  padding: 20px;
  border: 2px solid white;
  background-color: black;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  resize: none;
  &::placeholder {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  border: 2px solid #1d9bf0;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #1d9bf0;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTitForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tit, setTit] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTit(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const fileSize = file ? file.size / 1000 / 1024 : 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tit.length > 500 || fileSize > 5) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, `tits`), {
        tit,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        profilePic: user.photoURL,
      });
      if (file) {
        const locationRef = ref(storage, `tits/${user.uid}/${doc.id}`);
        const photoUploaded = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(photoUploaded.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setTit("");
      setFile(null);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={3}
        maxLength={500}
        value={tit}
        onChange={onChange}
        placeholder="What's new?"
      />
      <AttachFileButton htmlFor="file">
        {file
          ? fileSize > 5
            ? "Photo exceeded 5MB ❌"
            : "Photo added ✅"
          : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tit"} />
    </Form>
  );
}
