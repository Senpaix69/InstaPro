import { atom } from "recoil";

const likesView = atom({
  key: "likesView",
  default: false,
});

const commentsView = atom({
  key: "commentsView",
  default: false,
});

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
  likesView,
  commentsView,
  modelState,
  postView,
  storyState,
  themeState,
  userActivity,
};
