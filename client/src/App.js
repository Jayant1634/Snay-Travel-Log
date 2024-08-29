import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const PopupContent = styled.div`
  padding: 10px;
  max-width: 200px;
`;

const MarkerIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.isNew ? '#ff4136' : '#ffdc00'};
  border: 2px solid #ffffff;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 27.5530, lng: 76.6346 });

  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: 27.5530, lng: 76.6346
  };

  // Fetch log entries from API
  const getEntries = async () => {
    try {
      const entries = await listLogEntries();
      setLogEntries(entries);
    } catch (error) {
      console.error('Failed to fetch log entries:', error);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);

  const handleMapClick = (event) => {
    setAddEntryLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });

  };

  return (
    <MapContainer>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={4}
          center={mapCenter}
          onClick={handleMapClick}
        >
          {logEntries.map(entry => (
            <Marker
              key={entry._id}
              position={{ lat: entry.latitude, lng: entry.longitude }}
              onClick={() => setSelectedEntry(entry)}
            >
              <MarkerIcon />
            </Marker>
          ))}

          {selectedEntry && (
            <InfoWindow
              position={{ lat: selectedEntry.latitude, lng: selectedEntry.longitude }}
              onCloseClick={() => setSelectedEntry(null)}
            >
              <PopupContent>
                <h3>{selectedEntry.title}</h3>
                <p>{selectedEntry.comments}</p>
                <small>Visited on: {new Date(selectedEntry.visitDate).toLocaleDateString()}</small>
                {selectedEntry.image && <img src={selectedEntry.image} alt={selectedEntry.title} style={{maxWidth: '100%', marginTop: '10px'}} />}
              </PopupContent>
            </InfoWindow>
          )}

          {addEntryLocation && (
            <InfoWindow
              position={addEntryLocation}
              onCloseClick={() => setAddEntryLocation(null)}
            >
              <PopupContent>
                <LogEntryForm
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                  location={addEntryLocation}
                />
              </PopupContent>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </MapContainer>
  );
};

export default App;
