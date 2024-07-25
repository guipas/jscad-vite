import "./App.css";
import { Canvas } from "@react-three/fiber";
import { design } from "./design/design";
import { JSCadObject } from "./JscadObject";
import { OrbitControls } from "@react-three/drei";

import stl from "@jscad/stl-serializer";
import { useEffect, useMemo, useRef, useState } from "react";
import { GeometryBrowser } from "./components/GeomtryBrowser";
import { finalFirst } from "./utils";

const colors = [
  0x000000, 0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00,
  0xffffff,
];

function App() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [aProps, setAProps] = useState<null | {
    href: string;
    download: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geometriesVisibility, setGeometriesVisibility] = useState<
    Record<string, boolean>
  >({});

  const geo = useMemo(() => design({ scale: 1 }), []);

  useEffect(() => {
    setGeometriesVisibility((prev) => {
      const newVisibility: Record<string, boolean> = {};
      Object.keys(geo).forEach((key) => {
        newVisibility[key] = prev[key] ?? true;
      });

      return newVisibility;
    });
  }, [geo]);

  const exportToStl = () => {
    setIsLoading(true);
    const rawData = stl.serialize({ binary: true }, geo.final);
    const blob = new Blob(rawData);

    const url = window.URL.createObjectURL(blob);

    setAProps({ href: url, download: "design.stl" });
    setIsLoading(false);
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
        className=" bg-slate-950"
      >
        <ambientLight intensity={0.5} />
        <OrbitControls enabled makeDefault />
        <directionalLight position={[-100, 100, 100]} intensity={1} />
        <directionalLight position={[-100, -100, 100]} intensity={1} />
        {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
        {Object.keys(geo)
          .sort(finalFirst)
          .map((key, i) =>
            geometriesVisibility[key] ? (
              <JSCadObject
                key={key}
                jsCadGeometry={geo[key]}
                color={colors[i % colors.length]}
                // wireframe={i !== 0}
              />
            ) : null
          )}
      </Canvas>
      <GeometryBrowser
        className="absolute top-0 left-0 p-4 z-10"
        geometries={geometriesVisibility}
        onChange={(visibility) => setGeometriesVisibility(visibility)}
      />
      <div className="absolute top-0 right-0 p-4 z-10">
        <button
          type="button"
          onClick={exportToStl}
          className={`bg-purple-900 text-white py-2 px-4 rounded border border-purple-500 ${
            aProps ? "hidden" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Export to STL"}
        </button>
        {aProps && (
          <a
            ref={ref}
            {...aProps}
            className="block bg-purple-900 text-white py-2 px-4 rounded border border-purple-500"
            onClick={() => setAProps(null)}
          >
            Download File
          </a>
        )}
      </div>
    </>
  );
}

export default App;
