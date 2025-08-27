export default function TripList({ trips = [], onSelect, onDelete }) {
  if (!trips || trips.length === 0) {
    return <div className="empty-trips">No trips found — create one!</div>;
  }

  return (
    <div className="trip-cards">
      {trips.map((trip) => {
        const key = trip.id || trip._id || `${trip.destination}-${trip.start_date}`;
        const excerpt =
          trip.itinerary && trip.itinerary.length > 140
            ? trip.itinerary.slice(0, 140) + "…"
            : trip.itinerary || "";

        const interests =
          Array.isArray(trip.interests) ? trip.interests.join(", ") : trip.interests;

        return (
          <div className="trip-card" key={key}>
            <h3 className="trip-destination">{trip.destination}</h3>
            <p className="trip-dates">{trip.start_date} — {trip.end_date}</p>
            {trip.mood && <p className="trip-mood">Mood: {trip.mood}</p>}
            {interests && <p className="trip-interests">Interests: {interests}</p>}
            {excerpt && <p className="trip-excerpt">{excerpt}</p>}

            <div className="card-actions">
              <button className="card-button" onClick={() => onSelect(trip)}>
                View Itinerary
              </button>
              <button 
                className="card-button delete-button" 
                onClick={() => onDelete(trip.id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
