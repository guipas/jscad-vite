import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { subtract } from "@jscad/modeling/src/operations/booleans";
import { cuboid, sphere } from "@jscad/modeling/src/primitives";

export const design = (): Record<string, Geom3> => {
  const cube = cuboid({
    size: [110, 200, 210],
  });

  const ball = sphere({ radius: 100 });

  const final = subtract(cube, ball);

  // return an object where each property is a JSCAD geometry you want to visualize
  // the property named `final` is your final design
  // and you can pass other geometry as well, like `ball` in this case, that will also be displayed
  // this is usefull for debugging operations like subtract, as you can see the object that was subtracted
  return { final, ball };
};
