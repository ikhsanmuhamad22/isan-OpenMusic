const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator, verifyService) {
    this._service = service;
    this._validator = validator;
    this._verify = verifyService;

    autoBind(this);
  }

  async postExportHandler(req, h) {
    await this._validator.validateExportPayload(req.payload);
    const { playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._verify.verifyPlaylist(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail: req.payload.targetEmail,
    };

    await this._service.sendMessage('exports:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
