const autoBind = require('auto-bind');

class ActivitiesHandler {
  constructor(service, verifyService) {
    this._service = service;
    this._verify = verifyService;

    autoBind(this);
  }

  async getActivitiesPlaylists(req, h) {
    const playlistId = req.params.playlistIdJohn;
    const { id: credentialId } = req.auth.credentials;
    await this._verify.verifyPlaylistAccess(playlistId, credentialId);

    const activities = await this._service.getActivities(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ActivitiesHandler;
