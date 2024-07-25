import { subtract } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid, cylinder } from "@jscad/modeling/src/primitives";

export function holder() {
  const innerBarRadius = 27 / 2;
  const thickness = 5;
  const screwRadius = 6 / 2;
  const stickSize = 26.5;

  const negInnerBar = translate(
    [80 / 2 - innerBarRadius - 5],
    rotate(
      [Math.PI / 2],
      cylinder({
        radius: innerBarRadius,
        height: 30 * 2,
        segments: 64,
      })
    )
  );

  const screw = translate(
    [-80 / 2 + stickSize / 2 + 2],
    rotate(
      [Math.PI / 2, 0, 0],
      cylinder({
        radius: screwRadius,
        height: 50 * 2,
        segments: 64,
      })
    )
  );

  const negStick = translate(
    [-80 / 2 + stickSize / 2 + 2, 0, -50 / 4],
    cuboid({
      size: [stickSize, stickSize, 50],
    })
  );

  const core = cuboid({
    size: [80, 30, 50],
  });

  return { final: subtract(core, negInnerBar, negStick, screw), screw };
}
