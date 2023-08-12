const InvariantError = require('../../exceptions/InvariantError');
const songPayloadSechema = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSechema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
