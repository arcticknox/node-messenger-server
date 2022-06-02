const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const tokenSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true 
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      index: true,
    },
    members: [{
      type: String
    }],
    admins: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Channel = mongoose.model('Channel', tokenSchema);

module.exports = Channel;
