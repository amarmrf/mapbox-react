import React, { useState, useRef } from "react";
import {default as trailData} from "../data/trails.json";
import { Trails } from "./Map";
import "./list.css";


interface Props {
  reset: (val: Trails[]) => void,
  next: () => void,
  prev: () => void,
  home: () => void,
  filter: (val: Trails[]) => void,
  select: (val: { index: number, park: Trails}) => void,
  sort: (val: Trails[]) => void,
  selected: number,
  zoom: (val: boolean) => void
}
const List: React.FC<Props> = ({ reset, next, prev, home, filter, select, sort, selected, zoom }) => {
  const [trails, setTrails] = useState<Trails[]>(trailData.features);
  const sortVar = useRef('time');
  const countryFilter = useRef('All');
  const typeFilter = useRef('All');
  const lengthFilter = useRef('All');
  const loadState = useRef(false);
  
  // if filter use radio button then just turn each filter into array and loop it upon call
  const applyFilter = (val: string, meta: string) => {
    let filteredTrails = []
    if (meta === 'country') {
      countryFilter.current = val;    
      if (val === 'All') {
        filteredTrails = trailData.features;
      } else {
        filteredTrails = trailData.features.filter((trail: Trails) => trail.properties.country === val);
      }  
      // apply other currently active filter
      if (typeFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.type === typeFilter.current);
      }
      if (lengthFilter.current === 'Short') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length < 3);
      } else if (lengthFilter.current === 'Medium') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length >= 3 && trail.properties.length <= 7);      
      } else if (lengthFilter.current === 'Long') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length > 7);
      }
    } else if (meta === 'type') {
      typeFilter.current = val;
      if (val === 'All') {
        filteredTrails = trailData.features;
      } else {
        filteredTrails = trailData.features.filter((trail: Trails) => trail.properties.type === val);
      }
      // apply other currently active filter
      if (countryFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.country === countryFilter.current);
      }
      if (lengthFilter.current === 'Short') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length < 3);
      } else if (lengthFilter.current === 'Medium') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length >= 3 && trail.properties.length <= 7);        
      } else if (lengthFilter.current === 'Long') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.length > 7);
      } 
    } else {
      lengthFilter.current = val;

      if (val === 'Short') {
        filteredTrails = trailData.features.filter((trail: Trails) => trail.properties.length < 3);
      } else if (val === 'Medium') {
        filteredTrails = trailData.features.filter((trail: Trails) => trail.properties.length >= 3 && trail.properties.length <= 7);        
      } else if (val === 'Long') {
        filteredTrails = trailData.features.filter((trail: Trails) => trail.properties.length > 7);
      } else {
        filteredTrails = trailData.features;
      }
      // apply other currently active filter
      if (countryFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.country === countryFilter.current);
      }
      if (typeFilter.current !== 'All') {
        filteredTrails = filteredTrails.filter((trail: Trails) => trail.properties.type === typeFilter.current);
      }
    }
    // apply currently active sort
    if (sortVar.current === 'name') {
      filteredTrails = filteredTrails.sort((a: Trails, b: Trails) => a.properties.nameFr.localeCompare(b.properties.nameFr));
    } else {
      filteredTrails = filteredTrails.sort((a: Trails, b: Trails) => new Date(a.properties.visitedAt).valueOf() - new Date(b.properties.visitedAt).valueOf());
    }
    setTrails(filteredTrails);
    filter(filteredTrails);
  }

  const toggleSort = () => {
    let sortedTrails = [];
    if (sortVar.current === 'time') {
      sortVar.current = 'name';
      sortedTrails = trails.sort((a: Trails, b: Trails) => a.properties.nameFr.localeCompare(b.properties.nameFr));
    } else {
      sortVar.current = 'time'; 
      sortedTrails = trails.sort((a: Trails, b: Trails) => new Date(a.properties.visitedAt).valueOf() - new Date(b.properties.visitedAt).valueOf());
    }
    setTrails([...sortedTrails]);
    sort(sortedTrails)
  }

  const resetCustomization = () => {
    setTrails(trailData.features);
    sortVar.current = 'time';
    countryFilter.current = 'All';
    typeFilter.current = 'All';
    lengthFilter.current = 'All';
    reset(trailData.features);
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
            zoom(loadState.current);
            loadState.current = !loadState.current
          }}>
           { loadState.current  ? 'Zoom In' : 'Zoom Out' }
          </button>
      </div>
      <div>
        {trails.map((park: Trails, index: number) => (
          <p key={park.properties.parkId} className={`trailItem ${index === selected ? 'selectedListItem' : ''}`}> 
            {park.properties.name} 
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