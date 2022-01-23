import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "../data/campsites.json";
import { Room, Star } from '@mui/icons-material';
import { format } from "timeago.js";
import "./map.css";
import List from "./List";

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: -6.497195,
    longitude: 106.675595,
    zoom: 10.5
  });
  const [trails, setTrails] = useState(parkDate.default.features);
  const index = useRef(0);

  const [selectedPark, setSelectedPark] = useState(0);

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
    } else {
      handleHome()
    }
  }

  const handleHome = () => {
    index.current = 0
    setSelectedPark(null);
    setViewport({ ...viewport, latitude: -6.497195, longitude: 106.675595, zoom: 10.5})
  }

  const handleSelect = (val) =>{
    index.current = val.index + 1
    handleMarkerSelected(val.park);
  }

  const handleReset = (val) => {
    handleHome()
    setTrails(val);
  }

  const handleFilter = (val) => {
    handleHome()
    setTrails(val);
  }

  const handleSort = (val) => {
    setTrails(val);
    handleHome()
  }

  const handleMarkerSelected = (park) => {
    setSelectedPark(park);
    setViewport({ ...viewport, latitude: park.geometry.coordinates[1], longitude: park.geometry.coordinates[0] });
  };

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
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
        {trails.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
            offsetLeft={-3.5 * viewport.zoom}
            offsetTop={-1.5 * viewport.zoom}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                handleMarkerSelected(park);
              }}
            >
               <Room style={{
                  fontSize: 3 * viewport.zoom,
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
              <label>Rating</label>
              <div className="stars">
                  {Array(5).fill(<Star className="star" />)}
              </div>
              <label>Information</label>
              <span className="date">
                Visited {format(new Date("2016-08-20"))}
              </span>
            </div>
          </Popup>
        ) : null}
        <List reset={handleReset} next={handleNext} prev={handlePrev} home={handleHome} filter={handleFilter} select={handleSelect} sort={handleSort}/>
      </ReactMapGL>
    </div>
  )
};

export default Map;