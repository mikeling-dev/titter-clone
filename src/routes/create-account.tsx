import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Wrapper, Form, Error, getCustomErrorMessage, Input, Switcher, Title } from "../components/auth-components";
import GithubButton from "../components/github-btn";
import GoogleButton from "../components/google-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value}
    } = e;
    if(name === "name") {
      setName(value)
    } else if (name === "email") {
      setEmail(value)
    } else if(name === "password") {
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credentials.user, {
        displayName: name
      });
      navigate("/");
    } catch(e) {
        if(e instanceof FirebaseError) {
          setError(getCustomErrorMessage(e.code))
        }
    } finally {
      setIsLoading(false);
      console.log(name, email, password);
    }
  }

  return <Wrapper>
      <Title>Create 𝕋itter Account</Title>
      <Form onSubmit={onSubmit}>
        <Input name="name" value={name} onChange={onChange} placeholder="Name" type="text" required/>
        <Input name="email" value={email} onChange={onChange} placeholder="Email" type="email" required/>
        <Input name="password" value={password} onChange={onChange} placeholder="Password" type="password" required/>
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"}/>
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Login</Link>
      </Switcher>
      <GithubButton />
      <GoogleButton />
    </Wrapper>
    ;
  }