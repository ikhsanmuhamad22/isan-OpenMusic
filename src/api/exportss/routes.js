const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
