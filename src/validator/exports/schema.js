const joi = require('joi');

const ExportPayloadSchema = joi.object({
  targetEmail: joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPayloadSchema;
