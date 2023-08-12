const autoBind = require('auto-bind');
const Verify = require('../../service/postgres/verifyService');

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this._verify = new Verify();

    autoBind(this);
  }

  async postCollaborations(req, h) {
    await this._validator.validateCollaborationsPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;
    await this._verify.verifyPlaylistAccess(playlistId, credentialId);
    await this._verify.verifyUser(userId);

    const collaborationId = await this._service.addCollaborations(playlistId, userId);
    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborations(req, h) {
    const { playlistId, userId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    await this._verify.verifyPlaylist(playlistId, credentialId);

    await this._service.deleteColaborations(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'berhasil menghapus collaborations',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
