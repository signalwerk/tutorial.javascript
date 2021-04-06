export const URL = {
  course: `/api/course/js/basic/course.json`,
  chapter: ({ chapter }) => `/api/course/js/basic/chapter/${chapter}.json`,
  step: ({ chapter, step }) =>
    `/api/course/js/basic/chapter/${chapter}/${step}.json`,
};

export const ROUTE = {
  chapterFirstStep: ({ chapter }) => `/course/js/basic/${chapter}/overview`,
  step: ({ chapter, step }) => `/course/js/basic/${chapter}/${step}`,
};
