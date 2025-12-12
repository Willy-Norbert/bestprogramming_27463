import AuditLog from '../models/AuditLog.js';

export const logAction = (action, targetType = null) => {
  return async (req, res, next) => {
    // Log after response is sent
    res.on('finish', async () => {
      if (req.user && res.statusCode < 400) {
        try {
          await AuditLog.create({
            action,
            actorUserId: req.user._id,
            targetType,
            targetId: req.params?.id || null,
            meta: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
            },
          });
        } catch (error) {
          console.error('Failed to log action:', error);
        }
      }
    });

    next();
  };
};

