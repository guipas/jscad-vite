/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { booleans, colors, primitives } from "@jscad/modeling";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { cylinder, roundedCuboid } from "@jscad/modeling/src/primitives";
import { holder } from "./holder";
import { GeometriesTree } from "../types";

// const { intersect, subtract } = booleans;
const { colorize } = colors;
const { cube, cuboid, line, sphere, star } = primitives;

export const design = (parameters: any): GeometriesTree => {
  // const transpCube = colorize(
  //   [1, 1, 0, 0.5],
  //   cuboid({
  //     size: [110 * parameters.scale, 200, 210 + 200 * parameters.scale],
  //   })
  // );

  const baseSize = 60;
  const innerBarRadius = 27 / 2;
  const thickness = 5;
  const screwRadius = 5 / 2;
  const screwHeadRadius = 10 / 2;
  const screwHeadHeight = thickness / 3;

  const base = cuboid({
    size: [baseSize, baseSize, thickness],
    // roundRadius: 2,
    // segments: 64,
  });

  const bar = translate(
    [0, 0, innerBarRadius + thickness],
    rotate(
      [0, Math.PI / 2, 0],
      cylinder({
        radius: innerBarRadius,
        height: baseSize * 2,
        segments: 64,
      })
    )
  );

  const barHolderCore = translate(
    [0, 0, innerBarRadius + thickness],
    rotate(
      [0, Math.PI / 2, 0],
      cylinder({
        radius: innerBarRadius + thickness,
        height: baseSize,
        segments: 64,
      })
    )
  );

  const barholderBase = translate(
    [0, 0, (innerBarRadius + thickness) / 2],
    cuboid({
      size: [
        baseSize,
        innerBarRadius * 2 + thickness * 2,
        innerBarRadius + thickness + 2,
      ],
      // roundRadius: 2,
      // segments: 64,
    })
  );
  // const barHolderReinforcement = translate(
  //   [0, 0, (innerBarRadius + thickness) / 2 - 2],
  //   roundedCuboid({
  //     size: [
  //       innerBarRadius * 2 + thickness * 2,
  //       baseSize,
  //       innerBarRadius + thickness,
  //     ],
  //     roundRadius: 2,
  //     segments: 64,
  //   })
  // );

  const barHolder = union(barHolderCore, barholderBase);

  const margin = 1.5;
  const screwPlacement = [
    [
      baseSize / 2 - screwHeadRadius - margin,
      baseSize / 2 - screwHeadRadius - margin,
    ],
    [
      baseSize / 2 - screwHeadRadius - margin,
      -baseSize / 2 + screwHeadRadius + margin,
    ],
    [
      -baseSize / 2 + screwHeadRadius + margin,
      baseSize / 2 - screwHeadRadius - margin,
    ],
    [
      -baseSize / 2 + screwHeadRadius + margin,
      -baseSize / 2 + screwHeadRadius + margin,
    ],
  ];

  const holes = screwPlacement.map((placement) =>
    translate(
      [placement[0], placement[1], thickness / 2],
      cylinder({ radius: screwRadius, height: thickness * 10, segments: 64 })
    )
  );
  const holeHeads = screwPlacement.map((placement) =>
    translate(
      [placement[0], placement[1], thickness / 2 - screwHeadHeight / 2 + 0.5],
      cylinder({
        radius: screwHeadRadius,
        height: screwHeadHeight,
        segments: 64,
      })
    )
  );

  const final = subtract(
    union(base, subtract(barHolder, bar)),
    ...holes,
    ...holeHeads
  );

  const hold = holder();

  // return [base, barHolder];
  // return { hold };
  // return holder();
  return {
    final,
    others: {
      hold,
    },
  };
};
