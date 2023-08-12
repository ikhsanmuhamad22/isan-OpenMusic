const joi = require('joi');

const collaborationsPayloadSechema = joi.object({
  playlistId: joi.string(),
  userId: joi.string(),
});

module.exports = collaborationsPayloadSechema;
