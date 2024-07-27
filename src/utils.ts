import { Geom3 } from "@jscad/modeling/src/geometries/types";
import {
  GeometriesTree,
  GeometriesTreeSettings,
  GeometrySettings,
} from "./types";

export const finalFirst = (a: string, b: string) => {
  if (a === "final") return -1;
  else if (b === "final") return 1;
  else return 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isGeom3(value: any): value is Geom3 {
  return value && value.polygons && value.transforms;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isGeoSetting(value: any): value is GeometrySettings {
  return (
    (value &&
      Object.hasOwnProperty.call(value, "visible") &&
      Object.hasOwnProperty.call(value, "transparent")) ||
    Object.keys(value).length === 0
  );
}

export function makeSettingsFromTree(
  tree: GeometriesTree,
  previusSettings?: GeometriesTreeSettings
): GeometriesTreeSettings {
  return Object.keys(tree).reduce((acc, key) => {
    if (isGeom3(tree[key])) {
      acc[key] = previusSettings?.[key] || {
        visible: true,
        transparent: false,
      };
    } else {
      acc[key] = makeSettingsFromTree(
        tree[key] as GeometriesTree,
        previusSettings?.[key] as GeometriesTreeSettings
      );
    }
    return acc;
  }, {} as GeometriesTreeSettings);
}
