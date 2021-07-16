import pkg from "../../package.json";

const base = process.env.REACT_APP_DEV
  ? `${pkg.homepage}`
  : `${process.env.PUBLIC_URL}`;

export const URL = {
  course: `${base}/api/course/js/basic/course.json`,
  chapter: ({ chapter }) =>
    `${base}/api/course/js/basic/chapter/${chapter}.json`,
  step: ({ chapter, step }) =>
    `${base}/api/course/js/basic/chapter/${chapter}/${step}.json`,
  movie: ({ chapter, step }) =>
    process.env.REACT_APP_DEV
      ? `/movies/convert/course/js/basic/chapter/${chapter}/${step}/playlist.m3u8`
      : `https://www.escep.ch/videos/convert/course/js/basic/chapter/${chapter}/${step}/playlist.m3u8`,
};

export const ROUTE = {
  chapterFirstStep: ({ chapter }) => `/course/js/basic/${chapter}/overview`,
  step: ({ chapter, step }) => `/course/js/basic/${chapter}/${step}`,
};
