import { Geom3 } from "@jscad/modeling/src/geometries/types";

export interface GeometrySettings {
  visible?: boolean;
  transparent?: boolean;
}

export interface GeometriesTree {
  [key: string]: Geom3 | GeometriesTree;
}

export interface GeometriesTreeSettings {
  [key: string]: GeometrySettings | GeometriesTreeSettings;
}
