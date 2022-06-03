const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const MessageSchema = mongoose.Schema(
  {
    channelId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      index: true 
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      index: true,
    },
    ownerName: {
      type: String
    },
    message: {
      type: String
    },
    recipients: [{
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
MessageSchema.plugin(toJSON);
MessageSchema.plugin(paginate);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
