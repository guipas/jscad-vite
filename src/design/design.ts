/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, cylinder, sphere } from "@jscad/modeling/src/primitives";
import { GeometriesTree } from "../types";

export const design = (): GeometriesTree => {
  const margin = 0.5;
  const thickness = 2;
  const oneInch = 25.4 + margin;

  //  approach 1
  const barC = translate(
    [0, -oneInch - thickness, -oneInch - thickness],
    cuboid({ size: [oneInch * 20, oneInch, oneInch] })
  );
  const barB = translate(
    [thickness, 0, thickness],
    cuboid({ size: [oneInch, oneInch * 20, oneInch] })
  );
  const barA = translate(
    [-oneInch - thickness, thickness],
    cuboid({ size: [oneInch, oneInch, oneInch * 20] })
  );

  const core = translate(
    [-oneInch / 2, -oneInch / 2, -oneInch / 2],
    cuboid({
      size: [
        oneInch * 2 + thickness * 3,
        oneInch * 2 + thickness * 3,
        oneInch * 2 + thickness * 3,
      ],
    })
  );

  // const final = subtract(core, barA, barB, barC);

  // approach 2

  const unit1 = unit();
  const unit2 = translate(
    [0, 0, oneInch + thickness * 2 - margin],
    rotate([0, 0, Math.PI / 2], rotate([Math.PI / 2], unit1))
  );

  const final = union(unit1, unit2);

  // return an object where each property is a JSCAD geometry you want to visualize
  // the property named `final` is your final design
  // and you can pass other geometry as well, like `ball` in this case, that will also be displayed
  // this is usefull for debugging operations like subtract, as you can see the object that was subtracted
  return {
    final,
    // unit2,
    // inner,
    // core2,
    // screw,
    // screw1,
    // screw2,
    // screw3,
    // screw4,
    // screwHead,
    // screwHead2,
    // screwHead3,
    // screwHead4,
  };
};

function unit() {
  const margin = 0.5;
  const thickness = 2;
  const oneInch = 25.4 + margin;
  const inner = cuboid({ size: [oneInch * 20, oneInch, oneInch] });
  const core2 = cuboid({
    size: [
      oneInch + thickness * 2,
      oneInch + thickness * 2,
      oneInch + thickness * 2,
    ],
  });
  const screw = cylinder({ height: oneInch, radius: 3 });
  const screw1 = translate([0, 0, -oneInch / 2 - thickness], screw);
  const screw2 = rotate([Math.PI / 2], screw1);
  const screw3 = rotate([-Math.PI / 2], screw1);
  const screw4 = rotate([Math.PI], screw1);

  const screwHeadTemplate = cylinder({ height: thickness / 3, radius: 5 });
  const screwHead = translate(
    [0, 0, oneInch / 2 + thickness],
    screwHeadTemplate
  );
  const screwHead2 = translate(
    [0, 0, -oneInch / 2 - thickness],
    screwHeadTemplate
  );
  const screwHead3 = rotate([Math.PI / 2], screwHead);
  const screwHead4 = rotate([-Math.PI / 2], screwHead);

  const unit = subtract(
    core2,
    inner,
    screw1,
    // screw2,
    // screw3, // b
    // screw4, // a
    // screwHead, // a
    screwHead2
    // screwHead3, // b
    // screwHead4
  );

  return unit;
}
