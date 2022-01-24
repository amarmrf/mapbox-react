import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "../data/campsites.json";
import { Room, Star } from '@mui/icons-material';
import { format } from "timeago.js";
import "./map.css";
import List from "./List";

const Map = () => {
  const homeLoc = {
    latitude: -6.595038,
    longitude: 106.816635,
    zoom: 11
  }

  const center = {
    latitude: 5.98,
    longitude: 108.29,
    zoom: 3
  }

  const [viewport, setViewport] = useState(homeLoc);
  const [trails, setTrails] = useState(parkDate.default.features);
  const index = useRef(0);

  const [selectedPark, setSelectedPark] = useState(0);
  const [isHomeSelected, setIsHomeSelected] = useState(0);

  const handleZoomOut = () => {
    console.log('zoom out')
    setViewport({ ...viewport, ...center})
  }

  const handleNext = () => {
    if (index.current < trails.length) {
      index.current++;
      handleMarkerSelected(trails[index.current-1]);
    }
  }

  const handlePrev = () => {
    if (index.current > 1) {
      index.current--;
      handleMarkerSelected(trails[index.current-1]);
    }
  }

  const handleHome = () => {
    index.current = 0
    setSelectedPark(null);
    setIsHomeSelected(1);
    setViewport({ ...viewport, ...homeLoc})
  }

  const handleSelect = (val) =>{
    index.current = val.index + 1
    handleMarkerSelected(val.park);
  }

  const handleCustomize = (val) => {
    handleHome();
    setTrails(val);
  }

  const handleMarkerSelected = (park) => {
    setSelectedPark(park);
    setIsHomeSelected(0);
    setViewport({ ...viewport, latitude: park.geometry.coordinates[1], longitude: park.geometry.coordinates[0] });
  };

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
        setIsHomeSelected(0)
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        width="100%"
        height="100%"
        transitionDuration='200'
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        <Marker
            latitude={homeLoc.latitude}
            longitude={homeLoc.longitude}
            offsetLeft={-(viewport.zoom < 7 ? 5 : 3.5) * viewport.zoom}
            offsetTop={-(viewport.zoom < 7 ? 7 : 2.5) * viewport.zoom}
        >
          <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                handleHome();
              }}
            >
            <Room style={{
              fontSize: (viewport.zoom < 7 ? 8 : 4) * viewport.zoom,
              color: "tomato"
            }}/>
          </button>
        </Marker>

        {trails.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
            offsetLeft={-(viewport.zoom < 7 ? 5 : 3.5) * viewport.zoom}
            offsetTop={-(viewport.zoom < 7 ? 7 : 2.5) * viewport.zoom}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                handleMarkerSelected(park);
              }}
            >
               <Room style={{
                  fontSize: (viewport.zoom < 7 ? 8 : 4) * viewport.zoom,
                  color: "slateblue"
                }}/>
            </button>
          </Marker>
        ))}

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            anchor="left"
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div className="card">
              <label>Trail</label>
              <h4 className="place">{selectedPark.properties.NAME}</h4>
              <label>Review</label>
              <p className="desc">{selectedPark.properties.DESCRIPTIO}</p>
              <label>Length</label>
              <p className="desc">{selectedPark.properties.LENGTH} days</p>
              <label>Maximum Elevation</label>
              <p className="desc">{selectedPark.properties.MAX_ELEVATION} masl</p>
              <label>Rating</label>
              <div className="stars">
                  {selectedPark.properties.RATING? Array(selectedPark.properties.RATING).fill(<Star className="star" />) : 'N/A'}
              </div>
              <label>Information</label>
              <span className="date">
                Visited {format(new Date(selectedPark.properties.VISITED_AT))}
              </span>
            </div>
          </Popup>
        ) : null}

          {isHomeSelected ? (
          <Popup
          latitude={homeLoc.latitude}
          longitude={homeLoc.longitude}
            anchor="left"
            onClose={() => {
              setIsHomeSelected(0);
            }}
          >
            <div className="homeCard">
              <h4 className="place">Home sweet home</h4>
            </div>
          </Popup>
        ) : null}
        <List reset={handleCustomize} next={handleNext} prev={handlePrev} home={handleHome} filter={handleCustomize} select={handleSelect} sort={handleCustomize} selected={index.current-1} zoomOut={handleZoomOut} />
      </ReactMapGL>
    </div>
  )
};

export default Map;