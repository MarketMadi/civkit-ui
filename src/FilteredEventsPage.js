import React, { useState, useEffect, useRef } from 'react';

const FilteredEventsPage = () => {
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    wsRef.current.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      // Assuming eventData is an array of events
      const filteredEvents = eventData.filter(e => e.kind === 1); // Adjust the filter condition as needed
      setEvents(filteredEvents);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>Filtered Events</h2>
      {events.map((event, index) => (
        <div key={index}>
          <p>{JSON.stringify(event)}</p>
        </div>
      ))}
    </div>
  );
};

export default FilteredEventsPage;
