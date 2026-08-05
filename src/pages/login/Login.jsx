import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { login as loginApi } from "../../api";
import { useAuth } from "../../AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    loginApi(username, password)
      .then((data) => {
        login(data.token, data.username);
      })
      .catch((err) => {
        setError(err.message || "Invalid username or password");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Page>
      <Card>
        <Title>Policy Manager</Title>
        <Subtitle>Sign in to manage your Cedar policy files</Subtitle>

        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </SubmitButton>
        </Form>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  background: #fff;
  padding: 32px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 20px;
  margin: 0 0 4px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;

  &:focus {
    outline: none;
    border-color: #4a72d6;
  }
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  background: #4a72d6;
  color: #fff;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    background: #b0bcd8;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #c0392b;
  font-size: 13px;
  margin: 4px 0 0;
  text-align: center;
`;

export default Login;