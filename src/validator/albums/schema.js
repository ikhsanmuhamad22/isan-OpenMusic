const joi = require('joi');

const albumPayloadSechema = joi.object({
  name: joi.string().max(50).required(),
  year: joi.number().required(),
});

module.exports = albumPayloadSechema;
