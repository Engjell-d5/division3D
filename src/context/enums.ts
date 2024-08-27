export enum ObjectHelpers {
  COLLIDER = "_coll",
  MOUNT = "_mount",
  OBJECT = "_obj",
  PICKABLE_SURFACE = "_pick",
  ROOT = "__root__",
  RAY = "_ray",
  RIGHT = "_right",
  LEFT = "_left",
  FRONT = "_front",
  BACK = "_back",
  GROUND = "_ground",
}

export enum MovementStatus {
  IDLE = 0,
  ALLOWED = 1,
  DISALLOWED = 2
}

export enum MountOrientation {
  NONE = 0,
  FLOOR = 1,
  RIGHT_WALL = 2,
  LEFT_WALL = 3,
  FRONT_WALL = 4,
  BACK_WALL = 5,
}

export enum GridStatus {
  FREE = 0,
  TAKEN = 1,
  MOUNT = 2
}
