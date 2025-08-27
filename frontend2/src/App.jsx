// src/App.jsx
import { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./Navbar";
import TripForm from "./TripForm";
import Spinner from "./Spinner";
import { RenderMarkdown } from "./TripForm";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import TripsList from "./TripList";

export default function App() {
  const [view, setView] = useState("menu"); // 'menu' | 'form' | 'loading' | 'trips' | 'itinerary'
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [user, setUser] = useState(null);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Failed to sign in.");
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // clear local data on sign out:
      setTrips([]);
      setSelectedTrip(null);
      setView("menu");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleViewTrips = async () => {
    if (!user) {
      alert("Please sign in to view your trips.");
      return;
    }

    setView("loading");
    try {
      const response = await fetch(`http://127.0.0.1:5000/trips?user_id=${user.uid}`);
      const result = await response.json();

      if (response.ok) {
        // sort newest first (by start_date) so most recent trips show first:
        const sorted = (result.trips || []).slice().sort((a, b) => {
          const da = new Date(a.start_date || 0);
          const db = new Date(b.start_date || 0);
          return db - da;
        });

        setTrips(sorted);
        setView("trips");
      } else {
        alert("Failed to load trips.");
        setView("menu");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch past trips. Is your backend running and CORS enabled?");
      setView("menu");
    }
  };

  const handleStartTrip = () => setView("form");

  const handleFormSubmit = async (formData) => {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    setView("loading");

    try {
      const response = await fetch("http://127.0.0.1:5000/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: user.uid,
          user_email: user.email,
          interests: formData.interests
            .split(",")
            .map((interest) => interest.trim())
            .filter(Boolean),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // show the newly created trip
        setSelectedTrip(result.trip);
        // optionally add to the local trips list
        setTrips((prev) => [result.trip, ...prev]);
        setView("itinerary");
      } else {
        alert(`Error: ${result.error}`);
        setView("menu");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create trip. Check backend server.");
      setView("menu");
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    setView("itinerary");
  };

  const handleDeleteTrip = async (tripId) => {
  if (!user) return;

  if (!window.confirm("Are you sure you want to delete this trip?")) return;

  try {
    const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove trip from local state
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      // If the deleted trip is currently selected, clear it
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null);
        setView("trips");
      }
    } else {
      const result = await response.json();
      alert(result.message || "Failed to delete trip.");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting trip. Is your backend running?");
  }
};


  return (
    <>
      <Navbar user={user} onSignOut={handleSignOut} onViewTrips={handleViewTrips} />
      <div className="trip-form-wrapper">
        {!user ? (
          <div className="auth-container">
            <h2 className="welcome-message">Welcome to Trip Planner</h2>
            <button className="big-button" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            {view === "menu" && (
              <div className="menu-container">
                <h2 className="welcome-message">Welcome to Trip Maker!</h2>
                <div className="button-container">
                  <button className="big-button" onClick={handleStartTrip}>
                    Create Trip
                  </button>
                  <button className="big-button" onClick={handleViewTrips}>
                    View Past Trips
                  </button>
                </div>
              </div>
            )}



            {view === "form" && <TripForm onSubmit={handleFormSubmit} />}

            {view === "loading" && (
              <div className="loading-screen">
                <h2 className="loading-message">Generating Trip...</h2>
                <Spinner />
              </div>
            )}

            {view === "trips" && (
              <div className="trips-page">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 700 }}>
                  <h2>Your Trips</h2>
                  <div>
                    <button className="small-button" onClick={() => setView("menu")}>Back</button>
                  </div>
                </div>

                <TripsList 
                  trips={trips} 
                  onSelect={handleSelectTrip} 
                  onDelete={handleDeleteTrip} 
                />
              </div>
            )}

            {view === "itinerary" && selectedTrip && (
              <div className="itinerary-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 900 }}>
                  <h2>{selectedTrip.destination} — Itinerary</h2>
                  <div>
                    <button className="small-button" onClick={() => setView("trips")}>Back to Trips</button>
                  </div>
                </div>

                <div className="markdown">
                  <RenderMarkdown markdown={selectedTrip.itinerary || "No itinerary available."} />
                </div>
                <div className="itinerary-footer">
                  <small>Dates: {selectedTrip.start_date} — {selectedTrip.end_date}</small>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
