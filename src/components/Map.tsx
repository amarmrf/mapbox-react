import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {default as trailData} from "../data/trails.json";
import { Room, Star } from '@mui/icons-material';
import { format } from "timeago.js";
import "./map.css";
import List from "./List";

export interface Trails {
    type: string,
    properties: {
      parkId: number,
      visitedAt: string, 
      name: string,
      nameFr: string,
      description: string,
      country: string,
      length: number,
      rating: number | null,
      maxElevation: number,
      team: number,
      type: string
    },
    geometry: {
      type: string,
      coordinates: number[]
    }
}

const Map: React.FC = () => {
  const homeLoc = {
    latitude: -6.595038,
    longitude: 106.816635,
    zoom: 11
  }

  // center coordinate is hardcoded because not really the center of mass
  const center = {
    latitude: 5.98,
    longitude: 108.29,
    zoom: 3
  }

  const [viewport, setViewport] = useState(homeLoc);
  const [trails, setTrails] = useState<Trails[]>(trailData.features);
  const [selectedPark, setSelectedPark] = useState<Trails | null>(null);
  const [isHomeSelected, setIsHomeSelected] = useState(0);
  const index = useRef(0);
 
  const handleZoom = (val: boolean) => {
    if (!val) {
      setIsHomeSelected(0);
      setViewport({ ...viewport, ...center});
    } else if (selectedPark) {
      setViewport({ ...viewport, latitude: selectedPark.geometry.coordinates[1], longitude: selectedPark.geometry.coordinates[0], zoom: 11});
    } else {
      handleHome();
    }
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

  const handleSelect = (val: { index: number, park: Trails}) =>{
    index.current = val.index + 1
    handleMarkerSelected(val.park);
  }

  const handleCustomize = (val: Trails[]) => {
    index.current = 0
    setSelectedPark(null);
    setTrails(val);
  }

  const handleMarkerSelected = (park: Trails) => {
    setSelectedPark(park);
    setIsHomeSelected(0);
    setViewport({ ...viewport, latitude: park.geometry.coordinates[1], longitude: park.geometry.coordinates[0] });
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
        transitionDuration={200}
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

        {trails.map((park: Trails) => (
          <Marker
            key={park.properties.parkId}
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
              <h4 className="place">{selectedPark.properties.name}</h4>
              <label>Review</label>
              <p className="desc">{selectedPark.properties.description}</p>
              <label>Length</label>
              <p className="desc">{selectedPark.properties.length} days</p>
              <label>Maximum Elevation</label>
              <p className="desc">{selectedPark.properties.maxElevation} masl</p>
              <label>Rating</label>
              <div className="stars">
                  {selectedPark.properties.rating? Array(selectedPark.properties.rating).fill(<Star className="star" />) : 'N/A'}
              </div>
              <label>Information</label>
              <span className="date">
                Visited {format(new Date(selectedPark.properties.visitedAt))}
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
        <List reset={handleCustomize} next={handleNext} prev={handlePrev} home={handleHome} filter={handleCustomize} select={handleSelect} sort={handleCustomize} selected={index.current-1} zoom={handleZoom} />
      </ReactMapGL>
    </div>
  )
};

export default Map;