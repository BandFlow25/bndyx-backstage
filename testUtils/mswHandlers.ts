import { rest } from 'msw';

export const handlers = [
  // Add MSW handlers for Firebase REST endpoints or any APIs you need to mock
  // Example:
  // rest.get('https://firestore.googleapis.com/v1/projects/:project/databases/(default)/documents/:collection', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ documents: [] }));
  // }),
];
