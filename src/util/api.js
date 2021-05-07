export const URL = {
  course: `/api/course/js/basic/course.json`,
  chapter: ({ chapter }) => `/api/course/js/basic/chapter/${chapter}.json`,
  step: ({ chapter, step }) =>
    `/api/course/js/basic/chapter/${chapter}/${step}.json`,
  movie: ({ chapter, step }) =>
    `/movies/course/js/basic/chapter/${chapter}/${step}/index.mp4`,
};

export const ROUTE = {
  chapterFirstStep: ({ chapter }) => `/course/js/basic/${chapter}/overview`,
  step: ({ chapter, step }) => `/course/js/basic/${chapter}/${step}`,
};
