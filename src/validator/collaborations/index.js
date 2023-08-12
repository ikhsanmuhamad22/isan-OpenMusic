const InvariantError = require('../../exceptions/InvariantError');
const collaborationsPayloadSechema = require('./schema');

const CollaborationsValidator = {
  validateCollaborationsPayload: (payload) => {
    const validationResult = collaborationsPayloadSechema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
