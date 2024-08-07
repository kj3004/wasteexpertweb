import React, { useState, useEffect } from 'react';
import MapFull from '../Basic/MapFull';
import axios from 'axios';

function Map() {

  const [smartbins, setSmartbins] = useState([]);
  const [scheduleWaste, setScheduleWaste] = useState([]);

  //add or remove areas
  const area = ['area1','area2','area3','area4']

  //fetch smart bins from db
  const fetchSmartBin = async (callback) => {
    try {
      const response = await axios.post('http://localhost:3001/smartbin/getSmartBin');
      setSmartbins(response.data.smartbins);
      callback();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  //fetch schedules from db
  const fetchScheduleWaste = async (callback) => {
    try {
      const response = await axios.post('http://localhost:3001/schedule/getAllScheduleWaste'); // Use Axios for GET request
      setScheduleWaste(response.data.allScheduleWaste);
      callback();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSmartBin(() => {});
    fetchScheduleWaste(() => {});
  }, []);
  
  const binTypes = {
    Glass: [],
    Plastics: [],
    Paper: [],
    Organic: [],
    Metal: []
  };

  // categorize smart bins that fetch from db 
  smartbins.forEach(bin => {
    const { area, locationLat, locationLng, garbageTypes, fillLevel } = bin;
    console.log(garbageTypes)
    binTypes[garbageTypes].push({
      loc: { lat: locationLat, lng: locationLng },
      area: area,
      fillLevel: fillLevel,
    });
  });


  return (
    <div className="w-full h-full">
      <MapFull props={
        {
        type1: "food", foodbinLocation: binTypes.Organic,
        type2: "glass", glassbinLocation: binTypes.Glass,
        type3: "metal", matalLocation: binTypes.Metal,
        type4: "paper", paperbinLocation: binTypes.Paper,
        type5: "plastic", plasticbinLocation: binTypes.Plastics,
        Imagee1: "sched", ScheduleWaste: scheduleWaste,
        selections: area
      }
      } />
    </div>
  );
}

export default Map;
