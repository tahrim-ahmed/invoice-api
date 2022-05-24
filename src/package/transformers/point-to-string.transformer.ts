import { ValueTransformer } from 'typeorm';

export class PointToStringTransformer implements ValueTransformer {
  from = (v) => v;
  to = (v) => `${v.x},${v.y}`;
}
