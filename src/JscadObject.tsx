import { DoubleSide } from "three";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { JscadGeometry } from "./JscadGeometry";

export interface JSCadObjectProps {
  jsCadGeometry: Geom3;
}

export const JSCadObject = ({ jsCadGeometry }: JSCadObjectProps) => {
  const geometry = new JscadGeometry(jsCadGeometry, { debug: true });
  // todo memoize the geometry

  return (
    <>
      <mesh geometry={geometry} key={geometry.id}>
        <meshStandardMaterial
          color={0xffff00}
          side={DoubleSide}
          wireframe={false}
        />
      </mesh>
    </>
  );
};
