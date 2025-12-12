import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  actorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['user', 'resource', 'booking', 'system'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ actorUserId: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);

