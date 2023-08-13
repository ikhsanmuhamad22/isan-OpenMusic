const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exportss',
  version: '1.0.0',
  register: async (server, { service, validator, verifyService }) => {
    const exportsHandler = new ExportsHandler(service, validator, verifyService);
    server.route(routes(exportsHandler));
  },
};
