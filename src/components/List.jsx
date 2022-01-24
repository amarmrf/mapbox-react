import React, { useState, useRef } from "react";
import * as parkDate from "../data/campsites.json";
import "./list.css";

const List = ({ reset, next, prev, home, filter, select, sort, selected, zoomOut }) => {
  const [trails, setTrails] = useState(parkDate.default.features);
  const sortVar = useRef('time');
  const countryFilter = useRef('All');
  const typeFilter = useRef('All');
  const lengthFilter = useRef('All');
  
  // if filter use radio button then just turn each filter into array and loop it upon call
  const applyFilter = (val, meta) => {
    let filteredTrails = []
    if (meta === 'country') {
      countryFilter.current = val;    
      if (val === 'All') {
        filteredTrails = parkDate.default.features;
      } else {
        filteredTrails = parkDate.default.features.filter(trail => trail.properties.COUNTRY === val);
      }  
      // apply other currently active filter
      if (typeFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter(trail => trail.properties.TYPE === typeFilter.current);
      }
      if (lengthFilter.current === 'Short') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) < 3);
      } else if (lengthFilter.current === 'Medium') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) >= 3 && parseInt(trail.properties.LENGTH) <= 7);      
      } else if (lengthFilter.current === 'Long') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) > 7);
      }
    } else if (meta === 'type') {
      typeFilter.current = val;
      if (val === 'All') {
        filteredTrails = parkDate.default.features;
      } else {
        filteredTrails = parkDate.default.features.filter(trail => trail.properties.TYPE === val);
      }
      // apply other currently active filter
      if (countryFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter(trail => trail.properties.COUNTRY === countryFilter.current);
      }
      if (lengthFilter.current === 'Short') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) < 3);
      } else if (lengthFilter.current === 'Medium') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) >= 3 && parseInt(trail.properties.LENGTH) <= 7);        
      } else if (lengthFilter.current === 'Long') {
        filteredTrails = filteredTrails.filter(trail => parseInt(trail.properties.LENGTH) > 7);
      } 
    } else {
      lengthFilter.current = val;
      console.log(val)
      if (val === 'Short') {
        filteredTrails = parkDate.default.features.filter(trail => parseInt(trail.properties.LENGTH) < 3);
      } else if (val === 'Medium') {
        filteredTrails = parkDate.default.features.filter(trail => parseInt(trail.properties.LENGTH) >= 3 && parseInt(trail.properties.LENGTH) <= 7);        
      } else if (val === 'Long') {
        filteredTrails = parkDate.default.features.filter(trail => parseInt(trail.properties.LENGTH) > 7);
      } else {
        filteredTrails = parkDate.default.features;
      }
      // apply other currently active filter
      if (countryFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter(trail => trail.properties.COUNTRY === countryFilter.current);
      }
      if (typeFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter(trail => trail.properties.TYPE === typeFilter.current);
      }
    }
    // apply currently active sort
    if (sortVar.current === 'name') {
      filteredTrails = filteredTrails.sort((a,b) => a.properties.NAME_FR.localeCompare(b.properties.NAME_FR));
    } else {
      filteredTrails = filteredTrails.sort((a,b) => new Date(a.properties.VISITED_AT) - new Date(b.properties.VISITED_AT));
    }
    setTrails(filteredTrails);
    filter(filteredTrails);
  }

  const toggleSort = () => {
    let sortedTrails = [];
    if (sortVar.current === 'time') {
      sortVar.current = 'name';
      sortedTrails = trails.sort((a,b) => a.properties.NAME_FR.localeCompare(b.properties.NAME_FR));
    } else {
      sortVar.current = 'time'; 
      sortedTrails = trails.sort((a,b) => new Date(a.properties.VISITED_AT) - new Date(b.properties.VISITED_AT));
    }
    setTrails(sortedTrails);
    sort(sortedTrails)
  }

  const resetCustomization = () => {
    setTrails(parkDate.default.features);
    sortVar.current = 'time';
    countryFilter.current = 'All';
    typeFilter.current = 'All';
    lengthFilter.current = 'All';
    reset(parkDate.default.features);
  }

  return (
    <div className="listContainer">
      <h4>My Trail List</h4>
      <div className="customize">
          <div className="filterSelect">
            <select name="Country" value={countryFilter.current} id="country" onChange={e => {
              applyFilter(e.target.value, 'country');
            }}>
              <option value="All">All Countries</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Japan"> Japan </option>
              <option value="Nepal">Nepal</option>
            </select>
          </div>
          <div className="filterSelect">
            <select name="Type" id="type" value={typeFilter.current} onChange={e => {
              applyFilter(e.target.value, 'type');
            }}>
              <option value="All">All Type</option>
              <option value="Mountain">Mountain</option>
              <option value="Island"> Island </option>
              <option value="Alps">Alps</option>
            </select>
          </div>
          <div className="filterSelect">
            <select name="Length" id="length" value={lengthFilter.current} onChange={e => {
              applyFilter(e.target.value, 'length');
            }}>
              <option value="All">All Length</option>
              <option value="Short"> {'< 3 days'}</option>
              <option value="Medium"> {'3-7 days'} </option>
              <option value="Long"> {'> 7 days'}</option>
            </select>
          </div>
      </div>
      <div className="customize">
          <button className="customizeButton" onClick={e => {
            toggleSort();
          }}>
           { sortVar.current === 'name' ? 'Sort by Visited at' : 'Sort by Name'}
          </button>
          <button className="customizeButton" onClick={e => {
            resetCustomization();
          }}>
           Reset
          </button>
          <button className="customizeButton" onClick={e => {
            zoomOut();
          }}>
           Zoom Out
          </button>
      </div>
      <div>
        {trails.map((park, index) => (
          <p key={park.properties.PARK_ID} className={`trailItem ${index === selected ? 'selectedListItem' : ''}`}> 
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