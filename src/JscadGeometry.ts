import { Geom3, Poly3 } from "@jscad/modeling/src/geometries/types";
import { BufferAttribute, BufferGeometry, Matrix4, Vector3 } from "three";
import earcut from "earcut";
import _ from "lodash";

export interface JscadGeometryOptions {
  doTransforms?: boolean;
  debug?: boolean;
}

export class JscadGeometry extends BufferGeometry {
  debug = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...args: any[]) {
    if (this.debug) {
      console.log(...args);
    }
  }

  constructor(jscadGeometry: Geom3) {
    super();
    // console.log("jscadGeometry", jscadGeometry);
    // this.debug = options.debug || false;

    this.log("polygons", jscadGeometry.polygons.length);

    const vertices = new Float32Array(
      jscadGeometry.polygons.reduce<number[]>((acc, polygon) => {
        const vertices = this.triangulatePolygon(polygon);
        acc.push(...vertices);

        return acc;
      }, [])
    );

    this.log("vertices", vertices.length);

    this.setAttribute("position", new BufferAttribute(vertices, 3));

    // if (jscadGeometry.transforms && options.doTransforms) {
    const transforms = new Matrix4();
    transforms.set(...jscadGeometry.transforms).transpose();
    this.applyMatrix4(transforms);
    // }
    this.computeVertexNormals();
  }

  triangulatePolygon(polygon: Poly3): number[] {
    const vertices = _.flatten(polygon.vertices);
    const normal = JscadGeometry.getPolygonNormal(vertices);
    const axes = JscadGeometry.invertPolygonNormal(normal);
    const projectedVertices = JscadGeometry.projectToXYPlane(vertices, axes);
    const projectedIndices = earcut(projectedVertices, [], 3);
    const newVertices: number[] = [];
    projectedIndices.forEach((index) => {
      newVertices.push(vertices[index * 3]);
      newVertices.push(vertices[index * 3 + 1]);
      newVertices.push(vertices[index * 3 + 2]);
    });
    return newVertices;
  }

  static getPolygonNormal(vertices: number[]) {
    const v1 = new Vector3(
      vertices[3] - vertices[0],
      vertices[4] - vertices[1],
      vertices[5] - vertices[2]
    );
    const v2 = new Vector3(
      vertices[6] - vertices[0],
      vertices[7] - vertices[1],
      vertices[8] - vertices[2]
    );
    const normal = new Vector3();
    normal.crossVectors(v1, v2);
    normal.normalize();
    return normal;
  }

  // a function the invert a normalized vector3, ie if a dimension is equal to 1, set it to 0, if it is 0, set it to 1
  static invertPolygonNormal(vector: Vector3) {
    const invertedVector = new Vector3();
    invertedVector.x = Math.round(Math.abs(vector.x)) === 0 ? 1 : 0;
    invertedVector.y = Math.round(Math.abs(vector.y)) === 0 ? 1 : 0;
    invertedVector.z = Math.round(Math.abs(vector.z)) === 0 ? 1 : 0;
    return invertedVector;
  }

  static projectToXYPlane(vertices: number[], axes: Vector3) {
    const projectedVertices: number[] = [];
    vertices.forEach((vertex, index) => {
      if (index % 3 === 0) {
        if (axes.x === 0) {
          projectedVertices.push(vertices[index + 1]);
          projectedVertices.push(vertices[index + 2]);
          projectedVertices.push(0);
        } else if (axes.y === 0) {
          projectedVertices.push(vertices[index]);
          projectedVertices.push(vertices[index + 2]);
          projectedVertices.push(0);
        } else {
          projectedVertices.push(vertices[index]);
          projectedVertices.push(vertices[index + 1]);
          projectedVertices.push(0);
        }
      }
    });

    return projectedVertices;
  }
}
