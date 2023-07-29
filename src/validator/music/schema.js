const joi = require('joi');

const albumPayloadSechema = joi.object({
  name: joi.string().required(),
  year: joi.number().required(),
});

const songPayloadSechema = joi.object({
  title: joi.string().required(),
  year: joi.number().required(),
  performer: joi.string().required(),
  genre: joi.string().required(),
  duration: joi.number().required(),
  albumId: joi.string(),
});

module.exports = { albumPayloadSechema, songPayloadSechema };
