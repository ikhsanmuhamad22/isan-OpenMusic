const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{playlistIdJohn}/activities',
    handler: handler.getActivitiesPlaylists,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistIdJohn}/activities',
    handler: handler.getActivitiesPlaylists,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
