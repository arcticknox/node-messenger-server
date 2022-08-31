const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ChannelSchema = mongoose.Schema(
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
    orgId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ChannelSchema.plugin(toJSON);
ChannelSchema.plugin(paginate);

/**
 * @typedef Channel
 */
const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;
