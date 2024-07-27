import { Color, DoubleSide } from "three";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { JscadGeometry } from "./JscadGeometry";

export interface JSCadObjectProps {
  jsCadGeometry: Geom3;
  color?: Color | number;
  wireframe?: boolean;
  opacity?: number;
}

export const JSCadObject = ({
  jsCadGeometry,
  color,
  wireframe,
  opacity,
}: JSCadObjectProps) => {
  const geometry = new JscadGeometry(jsCadGeometry);
  // todo memoize the geometry

  return (
    <>
      <mesh geometry={geometry} key={geometry.id}>
        <meshStandardMaterial
          color={color || 0xffff00}
          side={DoubleSide}
          wireframe={wireframe}
          transparent
          opacity={opacity}
        />
      </mesh>
    </>
  );
};
