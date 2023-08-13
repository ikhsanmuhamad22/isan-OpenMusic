const UploadCoverHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, validator, albumsService }) => {
    const uploadCoverHandler = new UploadCoverHandler(service, validator, albumsService);
    server.route(routes(uploadCoverHandler));
  },
};
