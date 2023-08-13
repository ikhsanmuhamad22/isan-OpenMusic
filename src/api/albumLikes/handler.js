const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, verifyService) {
    this._service = service;
    this._verify = verifyService;

    autoBind(this);
  }

  async postAlbumsLikesHandler(req, h) {
    const { albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._verify.verifyAlbum(albumId);
    await this._service.userHasLikes(albumId, credentialId);
    await this._service.addAlbumLikes(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(req, h) {
    const { albumId } = req.params;
    const data = await this._service.getlikesAlbum(albumId);
    const likes = data.count;

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', data.source);
    response.code(200);
    return response;
  }

  async deletelikeAlbum(req, h) {
    const { albumId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._verify.verifyAlbum(albumId);
    await this._service.deleteLikeAlbum(albumId, credentialId);
    const response = h.response({
      status: 'success',
      message: 'berhasil unlike yeee',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumLikesHandler;
