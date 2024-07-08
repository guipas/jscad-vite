import "./App.css";
import { Canvas } from "@react-three/fiber";
import { design } from "./design";
import { JSCadObject } from "./JscadObject";
import { OrbitControls } from "@react-three/drei";

const geo = design({ scale: 1 });

function App() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      camera={{ position: [300, 300, 300], far: 10000, near: 0.1 }}
    >
      <ambientLight intensity={0.5} />
      <OrbitControls enabled makeDefault />
      <directionalLight position={[-100, 100, 100]} intensity={1} />
      <directionalLight position={[-100, -100, 100]} intensity={1} />
      {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      <JSCadObject jsCadGeometry={geo} />
    </Canvas>
  );
}

export default App;
