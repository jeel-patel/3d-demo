import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react';
import * as THREE from 'three';


const TextSprite = ({
    message = "Hello World",
    fontface = "Courier New",
    fontsize = 20,
    borderThickness = 4,
    borderColor = { r: 0, g: 0, b: 0, a: 1.0 },
    backgroundColor = "black",
    textColor = "white",
    position = [0, -1.25, 0],
    scale = [2.5, 1, 1],
  }) => {
    
    const spriteMaterial = useMemo(() => {
      // Create a canvas and context for drawing
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `Bold ${fontsize}px ${fontface}`;
  
      // Measure text size and configure canvas
      const metrics = context.measureText(message);
      const textWidth = metrics.width;
  
      // Set canvas size based on text metrics
      canvas.width = textWidth + borderThickness * 2;
      canvas.height = fontsize + borderThickness * 2;
  
      // Background
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // Text color
      context.fillStyle = textColor;
      context.fillText(message, canvas.width/2-textWidth/4, 10);
  
      // Create texture from canvas
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
  
      // Create sprite material
      return new THREE.SpriteMaterial({ map: texture });
    }, [message, fontface, fontsize, borderThickness, borderColor, backgroundColor, textColor]);
  
    return (
      <sprite position={position} scale={scale}>
        <primitive attach="material" object={spriteMaterial} />
      </sprite>
    );
  };
  

const SLOT_DIMENSIONS = [3, 0.5, 3]

function Slot({ rackNo, level, slot, position, label="Hello world", ...props }) {
    // console.log("SLOTS", props);
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={SLOT_DIMENSIONS} />
          <meshStandardMaterial color="blue" transparent opacity={0.5}/>
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <TextSprite message={`Co2: ${props.data ? props.data[rackNo] ? props.data[rackNo][level] ? props.data[rackNo][level][slot] ? props.data[rackNo][level][slot] : "N/A" : "N/A": "N/A": "N/A"}`}/>
      </group>
    );
}
  
function Rack({ rackNo, levels, slotsPerLevel, ...props }) {
    const slots = [];
    const rods = [];
    const rodHeight = levels * 3 + 0;

    // Generate Slots
    for (let i = 0; i < levels; i++) {
        for (let j = 0; j < slotsPerLevel; j++) {
            slots.push(
                <Slot
                key={`slot-${i}-${j}`}
                position={[j * 4.5, i * 3, 0]}
                rackNo={rackNo}
                level={i+1}
                slot={j+1}
                {...props}
                />
            );

            if(i===0){
                slots.push(<TextSprite message={`Slot ${j+1}`} position={[j * 4.5, -3, 0]} backgroundColor='red' textColor='black' scale={[2,1,1]}/>)
            }

        }
        slots.push(<TextSprite message={`Level ${i+1}`} position={[slotsPerLevel * 4.5, i * 3, 0]} backgroundColor='red' textColor='black'/>)
    }

    // Generate Rods
    const rodPositions = [
        [-2, rodHeight / 2 - 0.75, -1.5],
        [slotsPerLevel * 4.5 - 2.5, rodHeight / 2 - 0.75, -1.5],
        [-2, rodHeight / 2 - 0.75, 1.5],
        [slotsPerLevel * 4.5 - 2.5, rodHeight / 2 - 0.75, 1.5],
    ];

    rodPositions.forEach((pos, index) => {
        rods.push(
        <mesh key={`rod-${index}`} position={pos}>
            <cylinderGeometry args={[0.1, 0.1, rodHeight, 32]} />
            <meshStandardMaterial color="gray" />
        </mesh>
        );
    });

    rods.push(
        <mesh key={`rach-top`} position={[(slotsPerLevel * 4.5)/2 - 2.25, levels*3 - 1, 0]}>
            <TextSprite message={`Section ${rackNo}`} position={[0, 1, 0]} backgroundColor='red' textColor='black'/>
            <boxGeometry args={[slotsPerLevel*4.5, 0.5, 3]} />
            <meshStandardMaterial color="gray" />
        </mesh>   
    )

    return (
        <group>
        {slots}
        {rods}
        </group>
    );
}

function Sections({numOfRacks, ...props}) {

    // console.log("SECTIONS", props);
    let racks = [];

    for(let i=0; i<numOfRacks; i++) {
        racks.push(<group position={[0, 2, i*20]}>
            <Rack rackNo={i+1} {...props}/>
        </group>)
    }

    props.otherDevices.forEach((v) => {
        racks.push(<mesh position={[4.5*(v[2]-1), v[1]*3 - 1.5, (v[0]-1)*20]}>
            <boxGeometry args={[5, 2, 3]}/>
            <meshBasicMaterial color={"grey"}/>
        </mesh>);
    });

    return (<group>
        {racks}
    </group>)

}

//frameloop='demand' shadows="basic" flat linear orthographic
export function RoomGrid(props) {

    return (
        <div id="canvas-container" style={{height: "100vh", width: "100vw", boxSizing: "border-box"}}>
                <Canvas fallback={<div>Not available</div>} frameloop='always' flat linear>
                    <perspectiveCamera>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <mesh position={[props.slotsPerLevel*-2, props.levels*-2, (props.numOfRacks-1)*-10]}>
                        <Sections {...props}/>
                    </mesh>
                    <OrbitControls keyEvents={true} keys={{UP: "KeyW", BOTTOM: "KeyS", LEFT: "KeyA", RIGHT: "KeyD"}} autoRotate={props.autoRotate} autoRotateSpeed={0.5}/>  
                    {/* <Grid infiniteGrid={true} side={2} cellSize={1} sectionSize={1}/>   */}
                    </perspectiveCamera>
                    {/* <primitive object={new THREE.AxesHelper(3)}/> */}
                    {/* <primitive object={new THREE.GridHelper(Math.max(props.slotsPerLevel, props.numOfRacks)*10 + 10, 20)}/> */}
                </Canvas>
        </div>
    )
}