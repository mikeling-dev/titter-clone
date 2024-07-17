import { Link } from "react-router-dom";
import {
  Error,
  Input,
  Wrapper,
  Form,
  Title,
  getCustomErrorMessage,
  Switcher,
} from "../components/auth-components";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (email === "") return;
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(getCustomErrorMessage(e.code));
        console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Reset Password 🔐</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          type="email"
          onChange={onChange}
          value={email}
          placeholder="Enter the email address"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Reset Password"}
        />
        {error !== "" ? <Error>{error}</Error> : null}
      </Form>
      <Switcher>
        <Link to="/login">Go to login page</Link>
      </Switcher>
    </Wrapper>
  );
}
