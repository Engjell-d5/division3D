export enum CATEGORIES {
  COASTER = "coaster",
  KEYCHAIN = "keychain",
  CARD = "card",
  PINBACK_BUTTON = "pinback-button",
  STUFFED_ANIMAL = "stuffed-animal",
  PIN_BADGE = "pin-badge",
  ACRYLIC_STAND = "acrylic-stand",
  TOWEL = "towel",
  CAN_BUNDLE = "can-bundle",
  PEN = "pen",
  TSHIRT = "tshirt",
  PASS_HOLDER = "pass-holder",
  ART = "art",
  LONG_PANTS = "long-pants",
  POUCH = "pouch",
  STAND = "stand",
}

export enum PLACEABILITY {
  HORIZONTAL = "h",
  VERTICAL = "v",
  BOTH = "hv",
}

export const CATEGORIES_TO_PLACEABILITY = {
  [CATEGORIES.COASTER]: PLACEABILITY.HORIZONTAL,
  [CATEGORIES.KEYCHAIN]: PLACEABILITY.VERTICAL,
  [CATEGORIES.CARD]: PLACEABILITY.VERTICAL,
  [CATEGORIES.PINBACK_BUTTON]: PLACEABILITY.VERTICAL,
  [CATEGORIES.STUFFED_ANIMAL]: PLACEABILITY.HORIZONTAL,
  [CATEGORIES.PIN_BADGE]: PLACEABILITY.VERTICAL,
  [CATEGORIES.ACRYLIC_STAND]: PLACEABILITY.HORIZONTAL,
  [CATEGORIES.TOWEL]: PLACEABILITY.BOTH,
  [CATEGORIES.CAN_BUNDLE]: PLACEABILITY.HORIZONTAL,
  [CATEGORIES.PEN]: PLACEABILITY.BOTH,
  [CATEGORIES.TSHIRT]: PLACEABILITY.VERTICAL,
  [CATEGORIES.PASS_HOLDER]: PLACEABILITY.VERTICAL,
  [CATEGORIES.ART]: PLACEABILITY.VERTICAL,
  [CATEGORIES.LONG_PANTS]: PLACEABILITY.HORIZONTAL,
  [CATEGORIES.POUCH]: PLACEABILITY.BOTH,
  [CATEGORIES.STAND]: PLACEABILITY.HORIZONTAL,
};

export interface IModel {
  glb: string;
  png: string;
  category?: CATEGORIES;
}

const SAMPLE_MODELS = {
  "coaster1_fixed" : {
    glb : "assets/models/crib_cube.glb",
    png : "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/coaster-1.png",
    category : CATEGORIES.COASTER,
    placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.COASTER],
  },
  "mascot1_fixed" : {
    glb : "assets/models/floor_model.glb",
    png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/mascot-1.png",
    category : CATEGORIES.STUFFED_ANIMAL,
    placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STUFFED_ANIMAL],
  },
  // "acryllic-action-figure": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-action-figure-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-action-figure-1.png",
  //   category: CATEGORIES.ACRYLIC_STAND,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.ACRYLIC_STAND],
  // },
  // "acryllic-block": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-block-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-block-1.png",
  //   category: CATEGORIES.ACRYLIC_STAND,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.ACRYLIC_STAND],
  // },
  // "acryllic-charm": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-charm-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/acryllic-charm-1.png",
  //   category: CATEGORIES.KEYCHAIN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.KEYCHAIN],
  // },
  // "bday-card": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/bday-card-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/bday-card-1.png",
  //   category: CATEGORIES.STAND,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STAND],
  // },
  // bear: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/bear-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/bear-1.png",
  //   category: CATEGORIES.STUFFED_ANIMAL,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STUFFED_ANIMAL],
  // },
  // "button-charm": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/button-charm-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/button-charm-1.png",
  //   category: CATEGORIES.KEYCHAIN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.KEYCHAIN],
  // },
  // coaster: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/coaster-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/coaster-1.png",
  //   category: CATEGORIES.COASTER,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.COASTER],
  // },
  // "comic-charm": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/comic-charm-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/comic-charm-1.jpeg",
  //   category: CATEGORIES.KEYCHAIN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.KEYCHAIN],
  // },
  // diorama: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/diorama-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/diorama-1.png",
  //   category: CATEGORIES.STAND,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STAND],
  // },
  // frame: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/frame-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/frame-1.png",
  //   category: CATEGORIES.ART,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.ART],
  // },
  // "long-pants": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/long-pants-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/long-pants-1.jpeg",
  //   category: CATEGORIES.LONG_PANTS,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.LONG_PANTS],
  // },
  // mascot: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/mascot-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/mascot-1.png",
  //   category: CATEGORIES.STUFFED_ANIMAL,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STUFFED_ANIMAL],
  // },
  // "name-badge": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/name-badge-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/name-badge-1.png",
  //   category: CATEGORIES.PIN_BADGE,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.PIN_BADGE],
  // },
  // "pass-holder": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pass-holder-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pass-holder-1.png",
  //   category: CATEGORIES.KEYCHAIN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.KEYCHAIN],
  // },
  // "patch-keychain": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/patch-keychain-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/patch-keychain-1.png",
  //   category: CATEGORIES.KEYCHAIN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.KEYCHAIN],
  // },
  // pen: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pen-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pen-1.png",
  //   category: CATEGORIES.PEN,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.PEN],
  // },
  // "photo-stand": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/photo-stand-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/photo-stand-1.jpeg",
  //   category: CATEGORIES.STAND,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.STAND],
  // },
  // postcard: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/postcard-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/postcard-1.jpeg",
  //   category: CATEGORIES.CARD,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.CARD],
  // },
  // pouch: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pouch-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/pouch-1.png",
  //   category: CATEGORIES.POUCH,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.POUCH],
  // },
  // "status-card": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/status-card-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/status-card-1.png",
  //   category: CATEGORIES.CARD,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.CARD],
  // },
  // "t-shirt": {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/t-shirt-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/t-shirt-1.png",
  //   category: CATEGORIES.TSHIRT,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.TSHIRT],
  // },
  // towel: {
  //   glb: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/towel-1.glb",
  //   png: "https://storage.googleapis.com/klktn-assets-staging/crib-3d-models/towel-1.png",
  //   category: CATEGORIES.TOWEL,
  //   placeability: CATEGORIES_TO_PLACEABILITY[CATEGORIES.TOWEL],
  // }
};

export default SAMPLE_MODELS;
