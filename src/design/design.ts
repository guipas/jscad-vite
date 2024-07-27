/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { subtract } from "@jscad/modeling/src/operations/booleans";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, sphere } from "@jscad/modeling/src/primitives";
import { GeometriesTree } from "../types";

export const design = (): GeometriesTree => {
  const cube = cuboid({ size: [100, 100, 100] });
  const aSphere = translate([100 / 2, 0, 0], sphere({ radius: 50 }));

  const final = subtract(cube, aSphere);

  // return an object where each property is a JSCAD geometry you want to visualize
  // the property named `final` is your final design
  // and you can pass other geometry as well, like `ball` in this case, that will also be displayed
  // this is usefull for debugging operations like subtract, as you can see the object that was subtracted
  return {
    final,
    sphere: aSphere,
  };
};
