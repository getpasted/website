# Resident Copycat asset system

All character artwork uses the same `0 0 1254 1254` registration canvas.

- `copycat-master.svg` is the untouched approved vector trace.
- `copycat-underlay.svg` is the concealed dark anatomy shown beneath moving joints.
- `copycat-body.svg`, `copycat-head.svg`, `copycat-arm.svg`, `copycat-tail.svg`,
  `copycat-rear-leg.svg`, and `copycat-front-leg.svg` are registered animation sprites.
- `masks/` contains the anatomical extraction masks used to regenerate those sprites.

Stacking the sprites at identical bounds reconstructs the master pose. Animate each
sprite around its anatomical pivot; never resize or crop an individual sprite canvas.
