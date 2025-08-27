import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    mood: "",
    interests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2>Create Your Trip</h2>
      <p>Enter your preferences and we'll build a custom itinerary.</p>

      <div className="form-group">
        <label>Destination</label>
        <input
          type="text"
          name="destination"
          placeholder="E.g. Tokyo"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Mood</label>
        <input
          type="text"
          name="mood"
          placeholder="Relaxing, Adventurous..."
          value={formData.mood}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Interests</label>
        <input
          type="text"
          name="interests"
          placeholder="Food, Hiking, Culture..."
          value={formData.interests}
          onChange={handleChange}
          required
        />
        <p className="helper-text">Separate with commas</p>
      </div>

      <button type="submit">Create Trip</button>
    </form>
  );
}

// Export the markdown renderer separately
export function RenderMarkdown({ markdown }) {
  return (
    <div className="itinerary">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
