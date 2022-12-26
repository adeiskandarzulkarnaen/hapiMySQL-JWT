/* eslint-disable arrow-body-style */

const {
  login,
  createData,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/login',
    handler: login,
  },
  {
    method: 'POST',
    path: '/bio',
    handler: createData,
    options: {
      auth: 'hisStrategy',
    },
  },
];

module.exports = routes;
