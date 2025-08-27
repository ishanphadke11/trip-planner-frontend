import "./index.css";
import { auth } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { provider } from "./firebase";
import { FaGoogle } from "react-icons/fa";

export default function Navbar({ user, onSignOut, onViewTrips }) {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google Sign-In failed", err);
    }
  };

  return (
    <nav className="navbar">
      {/* Left side */}
      <div className="navbar-left">
        {user && (
          <button
            className="yellow-button"
            onClick={() => {
              if (typeof onViewTrips === "function") onViewTrips();
            }}
            title="View Your Saved Trips"
          >
            View Trips
          </button>
        )}
      </div>

      {/* Center */}
      <div className="navbar-center">
        <span className="navbar-title">Trip Planner</span>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="small-button" onClick={onSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="small-button" onClick={handleSignIn}>
            <FaGoogle style={{ marginRight: 6 }} />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
