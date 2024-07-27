import "./App.css";
import { Canvas } from "@react-three/fiber";
import { design } from "./design/design";
import { JSCadObject } from "./JscadObject";
import { OrbitControls } from "@react-three/drei";

import stl from "@jscad/stl-serializer";
import { useEffect, useMemo, useRef, useState } from "react";
import { GeometryBrowser } from "./components/GeometryBrowser/GeometryBrowser";
import { finalFirst, isGeom3, makeSettingsFromTree } from "./utils";
import { usePersistedState } from "./hooks/usePersistedState";

import { GeometriesTree, GeometriesTreeSettings } from "./types";
import _ from "lodash";

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
  const [settings, setSettings] = usePersistedState<GeometriesTreeSettings>(
    {},
    "geometriesSettings"
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitcontrols = useRef<any>(null);

  const geo = useMemo(() => design(), []);

  useEffect(() => {
    setSettings((prev) => {
      return makeSettingsFromTree(geo, prev);
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

  // console.log("settings", settings);
  return (
    <div className="min-h-dvh">
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
        <OrbitControls ref={orbitcontrols} enabled makeDefault />
        <directionalLight position={[-100, 100, 100]} intensity={1} />
        <directionalLight position={[-100, -100, 100]} intensity={1} />
        {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
        {/* {Object.keys(geo)
          .sort(finalFirst)
          .map((key, i) =>
            geometriesVisibility[key]?.visible ? (
              <JSCadObject
                key={key}
                jsCadGeometry={geo[key]}
                color={colors[i % colors.length]}
                // wireframe={i !== 0}
                opacity={geometriesVisibility[key]?.transparent ? 0.5 : 1}
              />
            ) : null
          )} */}
        <TreeJscad geo={geo} settings={settings} />
      </Canvas>
      <GeometryBrowser
        className="absolute top-0 left-0 z-10"
        settings={settings}
        onChangeSettings={(visibility) => setSettings(visibility)}
        onClearSettings={() => setSettings(makeSettingsFromTree(geo, {}))}
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
      <div className="absolute right-0 bottom-0 p-4">
        <button
          type="button"
          className="text-xs flex items-center justify-center  text-white h-6 w-6 rounded border border-gray-500"
          title="Reset Camera"
          onClick={() => {
            orbitcontrols?.current?.reset?.();
          }}
        >
          <i className="bi bi-camera-video"></i>
        </button>
      </div>
    </div>
  );
}

export default App;

interface TreeJscadProps {
  geo: GeometriesTree;
  settings?: GeometriesTreeSettings;
  path?: string[];
  index?: number;
}

function TreeJscad({ geo, path = [], settings, index = 0 }: TreeJscadProps) {
  if (isGeom3(geo)) {
    const settingsPath = path?.join(".");
    // console.log(`settings for ${settingsPath}`, settings);
    const setting = settingsPath ? _.get(settings, settingsPath) : undefined;
    if (setting?.visible === false) {
      return null;
    }
    return (
      <JSCadObject
        jsCadGeometry={geo}
        color={colors[index % colors.length]}
        opacity={setting?.transparent ? 0.5 : 1}
      />
    );
  } else {
    return (
      <>
        {Object.keys(geo)
          .sort(finalFirst)
          .map((name, i) => (
            <TreeJscad
              key={name}
              geo={geo[name] as GeometriesTree}
              index={i}
              path={[...path, name]}
              settings={settings}
            />
          ))}
      </>
    );
  }
}
