import { atom } from "recoil";

const modelState = atom({
  key: "modelState",
  default: false,
});

const postView = atom({
  key: "postView",
  default: false,
});

const storyState = atom({
  key: "storyState",
  default: false,
});

const themeState = atom({
  key: "theme",
  default: false,
});

const userActivity = atom({
  key: "userActivity",
  default: false,
});

export {
  modelState,
  postView,
  storyState,
  themeState,
  userActivity,
};
