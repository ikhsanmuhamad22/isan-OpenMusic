const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumsLikes',
  version: '1.0.0',
  register: async (server, { service, verifyService }) => {
    const albumLikesHandler = new AlbumLikesHandler(service, verifyService);
    server.route(routes(albumLikesHandler));
  },
};
