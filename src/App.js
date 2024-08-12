import { useEffect, useState } from "react";
import { RoomGrid } from "./RoomGrid";

// const RACKS=5;
// const LEVELS=5;
// const SLOTS_PER_LEVEL=8;


function App() {

  let [data, setData] = useState({});
  let [racks, setRacks] = useState(5);
  let [levels, setLevels] = useState(3);
  let [slots_per_level, setSlots] = useState(8);
  let [other_devices, setOtherDevices] = useState([]);
  let [device_rack, setDeviceRack] = useState();
  let [device_level, setDeviceLevel] = useState();
  let [device_slot, setDeviceSlot] = useState();
  let [autoRotate, setAutoRotate] = useState(false);
  let [currentCameraView, setCurrentCameraView] = useState(1);

  let addDevice = () => {
    setOtherDevices([...other_devices, [device_rack, device_level, device_slot]]);
  }

  useEffect(() => {

    let change_data = () => {

      let sensor_data = {};

      for(let i=1; i<=racks; i++){
        for(let j=1; j<=levels; j++){
          for(let k=1; k<=slots_per_level; k++){

            if(!sensor_data[i]) {
              sensor_data[i] = {};
            }

            if(!sensor_data[i][j]) {
              sensor_data[i][j] = {};
            }

            sensor_data[i][j][k] = Math.round(Math.random()*100);
          }
        }
      }

      setData(sensor_data);
      
      setTimeout(change_data, 15000);
    };

    setTimeout(change_data, 1);

  }, [racks, levels, slots_per_level]);

  return (
    <div>
      <div style={{position: 'fixed', border: '2px solid black', zIndex: '100', backgroundColor: "white"}}>
        <table>
          <tr>
            <td>
              <label htmlFor="section">Sections</label>
            </td>
            <td>
              <input id="section" min={1} max={20} step={1} value={racks} type="number" onChange={(e) => setRacks(e.target.value)}/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="levels">Levels</label>
            </td>
            <td>
              <input id="levels" min={1} max={10} step={1} value={levels} type="number" onChange={(e) => setLevels(e.target.value)}/> 
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="slots">Slots</label>
            </td>
            <td>
              <input id="slots" min={1} max={18} step={1} value={slots_per_level} type="number" onChange={(e) => setSlots(e.target.value)}/>
            </td>
          </tr>
          <br/>
          <tr>
            <td>
              ADD OTHER DEVICE
            </td>
            <td>
              <input type="number" step={0.1} min={1} max={20} value={device_rack} id="section" placeholder="Section" onChange={(e) => setDeviceRack(e.target.value)}/>
              <input type="number" step={0.1} min={1} max={10} value={device_level} id="levels" placeholder="Level" onChange={(e) => setDeviceLevel(e.target.value)}/>
              <input type="number" step={0.1} min={1} max={18} value={device_slot} id="slots" placeholder="Slot" onChange={(e) => setDeviceSlot(e.target.value)}/>
            </td>
            <td>
              <input type="button" value={"ADD"} onClick={() => {addDevice()}}/>
            </td>
          </tr>
          <tr>
            <td>
              Auto rotate?
            </td>
            <td>
              <input type="checkbox" value={autoRotate} onChange={() => setAutoRotate(!autoRotate)}/>
            </td>
          </tr>
          <br/>
          {
            Array.from({length: racks}, (_, index) => index+1).map((val) => {

              if(val===racks+1) {
                return (<tr>
                  <td style={{textAlign: "center"}}>
                    <input type="radio" id={`Camera-default`} name="camera" value={val} checked={currentCameraView==="default"} onChange={() => setCurrentCameraView("default")}/>
                  </td>
                  <td>
                    Default cam
                  </td>
                </tr>)
              }

              return (
                <tr>
                  <td style={{textAlign: "center"}}>
                    <input type="radio" id={`Camera-${val}`} name="camera" value={val} checked={currentCameraView===val} onChange={() => setCurrentCameraView(val)}/>
                  </td>
                  <td>
                    Section {val} cam
                  </td>
                </tr>
              )
            })
          }
        </table>
      </div>
      <RoomGrid numOfRacks={racks} levels={levels} slotsPerLevel={slots_per_level} data={data} otherDevices={other_devices} autoRotate={autoRotate} currentCameraView={currentCameraView}/>
    </div>
  );
}

export default App;
