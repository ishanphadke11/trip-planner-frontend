import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login({ onLogin }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Trip Planner</h2>
    </div>
  );
}
