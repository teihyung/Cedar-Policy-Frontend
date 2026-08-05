import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../api";
import { useAuth } from "../../AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = () => {
    setError(null);
    loginApi(username, password)
      .then((data) => {
        console.log("Login successful:", data);
        login(data.token, data.username);
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setError(err.message || "Invalid username or password");
      });
  };

  return (
    <>
      <h3> Welcome to the Cedar Policy Frontend </h3>
      <h3> Login to your account </h3>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default Login;