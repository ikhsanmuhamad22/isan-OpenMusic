const joi = require('joi');

const playlistPayloadSechema = joi.object({
  name: joi.string().max(50),
  songId: joi.string(),
});

module.exports = playlistPayloadSechema;
