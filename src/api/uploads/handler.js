const autoBind = require('auto-bind');

class UploadCoverHandler {
  constructor(service, validator, albumsService) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postImageCoverHandler(req, h) {
    const { cover } = req.payload;
    const id = req.params.albumid;
    await this._validator.validateImageCover(cover.hapi.headers);
    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/uploads/images-cover/${filename}`;

    await this._albumsService.addAlbumCover({ cover: fileLocation, id });

    const response = h.response({
      status: 'success',
      message: 'sampul berhasil di unggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadCoverHandler;
