import "./App.css";
import { Canvas } from "@react-three/fiber";
import { design } from "./design";
import { JSCadObject } from "./JscadObject";
import { OrbitControls } from "@react-three/drei";

import stl from "@jscad/stl-serializer";
import { useRef, useState } from "react";

const geo = design({ scale: 1 });

function App() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [aProps, setAProps] = useState<null | {
    href: string;
    download: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const exportToStl = () => {
    setIsLoading(true);
    const rawData = stl.serialize(
      { binary: true },
      Array.isArray(geo) ? geo[0] : geo
    );
    const blob = new Blob(rawData);

    const url = window.URL.createObjectURL(blob);
    // a.href = url;
    // a.download = fileName;
    // a.click();
    // window.URL.revokeObjectURL(url);

    setAProps({ href: url, download: "design.stl" });
    setIsLoading(false);
    // ref.current?.click();
  };
  return (
    <>
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
        {Array.isArray(geo) ? (
          geo.map((g) => <JSCadObject jsCadGeometry={g} />)
        ) : (
          <JSCadObject jsCadGeometry={geo} />
        )}
      </Canvas>
      {aProps && (
        <a
          ref={ref}
          {...aProps}
          style={{
            position: "absolute",
            zIndex: 1,
            top: 60,
            right: 10,
            color: "white",
            backgroundColor: "red",
          }}
          onClick={() => setAProps(null)}
        >
          Download File
        </a>
      )}
      <button
        type="button"
        onClick={exportToStl}
        style={{
          position: "absolute",
          zIndex: 1,
          top: 10,
          right: 10,
          color: "white",
          backgroundColor: "blue",
        }}
      >
        Export to STL
      </button>
    </>
  );
}

export default App;
