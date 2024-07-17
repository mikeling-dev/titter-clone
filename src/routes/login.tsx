import { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Wrapper, Form, Error, getCustomErrorMessage, Input, Switcher, Title } from "../components/auth-components";
import GithubButton from "../components/github-btn";
import GoogleButton from "../components/google-btn";



export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value}
    } = e;
    if (name === "email") {
      setEmail(value)
    } else if(name === "password") {
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")
    if (isLoading || email === "" || password === "") return;
    try {
        setIsLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/")
    } catch(e) {
        if(e instanceof FirebaseError) {
          setError(getCustomErrorMessage(e.code))
          console.log(e)
        }
    } finally {
      setIsLoading(false);
    }
  }

  
  return (
  <Wrapper>
      <Title>Log into 𝕋itter</Title>
      <Form onSubmit={onSubmit}>
        <Input name="email" value={email} onChange={onChange} placeholder="Email" type="email" required/>
        <Input name="password" value={password} onChange={onChange} placeholder="Password" type="password" required/>
        <Input type="submit" value={isLoading ? "Loading..." : "Login"}/>
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have Titties ? <Link to="/create-account">Create 𝕋itties ➡️</Link>
      </Switcher>
      <Switcher> <Link to={"/reset-password"}>Reset password 😥</Link> </Switcher> 
      <GithubButton />
      <GoogleButton />
    </Wrapper>
  )
  }