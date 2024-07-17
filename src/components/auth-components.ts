import { styled } from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
  width: 420px;
`;

export const Title = styled.h1`
  font-size: 36px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  text-align: center;
  &[type="submit"] {
    background-color: #1d9bf0;
    color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;
export const Error = styled.span`
  font-weight: 600;
  margin-bottom: 10px;
  color: tomato;
  text-align: center;
`;
export const Switcher = styled.h3`
  margin-bottom: 10px;
  a {
    color: #1d9bf0;
  }
`;

export const getCustomErrorMessage = (errorCode: any) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please try another email.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again";
    case "auth/account-exists-with-different-credential":
      return "You have already signed up with this email before";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

export const Button = styled.span`
  background-color: white;
  font-weight: 600;
  width: 100%;
  color: black;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const Logo = styled.img`
  height: 25px;
`;
