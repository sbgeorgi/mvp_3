/// <reference types="vite/client" />

// Respect Vite base paths so each concept also works under its own subfolder.
const mediaUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const IMG = {
  supplements: mediaUrl("images/real-supplements.jpg"),
  hero: mediaUrl("images/real-gym-floor-detail.jpg"),
  adrian: mediaUrl("images/social-adrian.jpg"),
  island: mediaUrl("images/real-gym-visitor.jpg"),
  rack: mediaUrl("images/real-gym-floor.jpg"),
  barbell: mediaUrl("images/real-strength.jpg"),
  shadow: mediaUrl("images/real-gym-visitor.jpg"),
  barFloor: mediaUrl("images/real-bench.jpg"),
  plate: mediaUrl("images/real-strength.jpg"),
  variety: mediaUrl("images/real-gym-machines.jpg"),
  dbLift: mediaUrl("images/real-press.jpg"),
  bodybuilder: mediaUrl("images/social-conditioning.jpg"),
  redDb: mediaUrl("images/real-gym-visitor.jpg"),
  flex: mediaUrl("images/real-strength.jpg"),
  foad1: mediaUrl("images/real-coaching.jpg"),
  foad2: mediaUrl("images/real-gym-machines.jpg"),
  foad3: mediaUrl("images/real-bench.jpg"),
  bench: mediaUrl("images/real-bench.jpg"),
  coach1: mediaUrl("images/social-personal-training.jpg"),
  coach2: mediaUrl("images/social-adrian.jpg"),
  spot: mediaUrl("images/real-bench.jpg"),
  duo: mediaUrl("images/social-community.jpg"),
  treadmills: mediaUrl("images/real-cardio.jpg"),
  runFeet: mediaUrl("images/real-cardio.jpg"),
  cardio: mediaUrl("images/real-cardio.jpg"),
  poke1: mediaUrl("images/real-juice-bar-collage.png"),
  poke2: mediaUrl("images/real-juice-bar.jpg"),
  apparel: mediaUrl("images/adrians-gym-mark.svg"),
  shaker: mediaUrl("images/social-supplement-bag.jpg"),
  shake: mediaUrl("images/real-juice-bar-collage.png"),
  womanOverhead: mediaUrl("images/real-gym-machines.jpg"),
  womanBar: mediaUrl("images/social-community.jpg"),
  womanLift: mediaUrl("images/social-strength.jpg"),
  bayIslands: mediaUrl("images/real-gym-floor.jpg"),
};

export const VIDEO = {
  // The autoplay hero film selected in MVP 1.
  hero: "https://videos.pexels.com/video-files/3196220/3196220-hd_1920_1080_25fps.mp4",
  dumbbell: mediaUrl("videos/real-training-preview.mp4"),
  blue: mediaUrl("videos/real-gym-preview.mp4"),
};

export const REFERENCES = {
  pricing: mediaUrl("images/pricing-and-amenities-reference.png"),
  group: mediaUrl("images/group-plan-reference.png"),
};
