import React, { useState, useRef } from "react";
import * as parkDate from "../data/campsites.json";
import "./list.css";

const List = ({ reset, next, prev, home, filter, select, sort }) => {
  const [trails, setTrails] = useState(parkDate.default.features);
  const sortVar = useRef('time');


  const handleFilter = () => {
    if (trails.length < parkDate.features.length - 2) {
      if (trails[0].properties.NAME !== 'Mount Arjuno') {
        setTrails([...parkDate.default.features].reverse())
      } else {
        setTrails([...parkDate.default.features])
      }
    } else {
      setTrails([...trails].splice(0, trails.length-1));
    }
    filter(trails);
  }
  
  const handleSort = () => {
    let sortedTrails = [];
    if (sortVar.current === 'time') {
      sortVar.current = 'name';
      sortedTrails = [...trails].sort((a,b) => a.properties.NAME_FR.localeCompare(b.properties.NAME_FR));
    } else {
      sortVar.current = 'time'; 
      sortedTrails = [...trails].sort((a,b) => new Date(a.properties.VISITED_AT) - new Date(b.properties.VISITED_AT));
    }
    setTrails(sortedTrails);
    sort(sortedTrails)
  }


  return (
    <div className="listContainer">
      <h4>Trails Walked</h4>
      <div className="customize">
          <button className="customizeButton" onClick={e => {
            setTrails([...parkDate.default.features]);
            sortVar.current = 'time'
            reset(trails);
          }}>
           Reset
          </button>
          <button className="customizeButton" onClick={e => {
            handleSort();
          }}>
           { sortVar.current === 'name' ? 'Time Sort' : 'Name Sort'}
          </button>
          <button className="customizeButton" onClick={e => {
            handleFilter();
          }}>
            Filter
          </button>
      </div>
      <div>
        {trails.map((park, index) => (
          <p key={park.properties.PARK_ID} className="trailItem"> 
            {park.properties.NAME} 
            <button className="selectButton" onClick={e => {
              select({ park, index });
            }}>
              Select
            </button>
          </p>
        ))}
      </div>
      <div className="nav">
          <button className="navButton" onClick={e => {
            prev();
          }}>
            Prev
          </button>
          <button className="navButton" onClick={e => {
            home();
          }}>
           Home
          </button>
          <button className="navButton" onClick={e => {
            next();
          }}>
            Next
          </button>
      </div>
    </div>
  );
}

export default List