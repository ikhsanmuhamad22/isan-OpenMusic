const joi = require('joi');

const songPayloadSechema = joi.object({
  title: joi.string().max(50).required(),
  year: joi.number().required(),
  performer: joi.string().required(),
  genre: joi.string().max(50).required(),
  duration: joi.number().required(),
  albumId: joi.string(),
});

module.exports = songPayloadSechema;
