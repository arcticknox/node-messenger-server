const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const OrgSchema = mongoose.Schema({
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
  active: {
    type: Boolean,
    enum: [true, false],
    default: true,
    required: true
  },
}, {
  timestamps: true,
});

OrgSchema.plugin(toJSON);
OrgSchema.plugin(paginate);

module.exports.Org = mongoose.model('Org', OrgSchema);
