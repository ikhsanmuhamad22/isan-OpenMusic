const InvariantError = require('../../exceptions/InvariantError');
const { albumPayloadSechema, songPayloadSechema } = require('../schema');

const MusicValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumPayloadSechema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSechema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MusicValidator;
