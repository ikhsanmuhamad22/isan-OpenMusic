class MusicHandler {
  constructor(service) {
    this._service = service;

    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
  }

  async postAlbumsHandler(req, h) {
    try {
      const { name, year } = req.payload;
      console.log(name);
      console.log(year);
      console.log(await this._service);
      const musicId = await this._service.addAlbums({ name, year });
      const response = h.response({
        status: 'success',
        message: 'berhasil menambah album',
        data: {
          musicId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MusicHandler;
