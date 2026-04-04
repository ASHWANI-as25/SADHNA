/**
 * Error Handling & Logging Utility
 * Provides centralized error management and logging
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL'
};

const isDevelopment = import.meta.env.MODE === 'development';

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] ${level}: ${message}`;
  
  if (data) {
    log += ` ${JSON.stringify(data, null, 2)}`;
  }
  
  return log;
};

export const logger = {
  debug: (message, data) => {
    if (isDevelopment) {
      const formatted = formatLog(LOG_LEVELS.DEBUG, message, data);
      console.log(`🔍 ${formatted}`);
    }
  },

  info: (message, data) => {
    const formatted = formatLog(LOG_LEVELS.INFO, message, data);
    console.log(`ℹ️ ${formatted}`);
  },

  warn: (message, data) => {
    const formatted = formatLog(LOG_LEVELS.WARN, message, data);
    console.warn(`⚠️ ${formatted}`);
  },

  error: (message, error, data) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const formatted = formatLog(LOG_LEVELS.ERROR, message, { error: errorMsg, ...data });
    console.error(`❌ ${formatted}`);
  },

  fatal: (message, error, data) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const formatted = formatLog(LOG_LEVELS.FATAL, message, { error: errorMsg, ...data });
    console.error(`🚨 ${formatted}`);
  }
};

/**
 * Database Error Types
 */
export const DbErrorType = {
  NOT_CONFIGURED: 'DB_NOT_CONFIGURED',
  MISSING_TABLE: 'MISSING_TABLE',
  INVALID_DATA: 'INVALID_DATA',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Identify database error type
 */
export const identifyDbError = (error) => {
  if (!error) return DbErrorType.UNKNOWN;
  
  const message = error.message || String(error);
  
  if (message.includes('not configured') || message.includes('placeholder')) {
    return DbErrorType.NOT_CONFIGURED;
  }
  if (message.includes('does not exist') || message.includes('relation')) {
    return DbErrorType.MISSING_TABLE;
  }
  if (message.includes('permission') || message.includes('auth')) {
    return DbErrorType.PERMISSION_DENIED;
  }
  if (message.includes('network') || message.includes('timeout')) {
    return DbErrorType.NETWORK_ERROR;
  }
  if (message.includes('invalid') || message.includes('constraint')) {
    return DbErrorType.INVALID_DATA;
  }
  
  return DbErrorType.UNKNOWN;
};

/**
 * User-friendly error messages
 */
export const getErrorMessage = (errorType, context = '') => {
  const messages = {
    [DbErrorType.NOT_CONFIGURED]: `Database not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local. ${context}`,
    [DbErrorType.MISSING_TABLE]: `Database table missing. Please run migrations. ${context}`,
    [DbErrorType.INVALID_DATA]: `Invalid data format. Please check your inputs. ${context}`,
    [DbErrorType.PERMISSION_DENIED]: `You don't have permission to perform this action. ${context}`,
    [DbErrorType.NETWORK_ERROR]: `Network error. Please check your connection. ${context}`,
    [DbErrorType.UNKNOWN]: `An unexpected error occurred. ${context}`
  };
  
  return messages[errorType] || messages[DbErrorType.UNKNOWN];
};

/**
 * Safe async operation wrapper with error handling
 */
export const safeAsync = async (operation, operationName = 'operation', timeoutMs = 5000) => {
  try {
    // Create a timeout promise that rejects after timeoutMs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs)
    );
    
    // Race the operation against the timeout
    const result = await Promise.race([operation(), timeoutPromise]);
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    logger.error(`Failed: ${operationName}`, error);
    const errorType = identifyDbError(error);
    return {
      success: false,
      data: null,
      error: {
        type: errorType,
        message: getErrorMessage(errorType, operationName),
        originalError: error.message
      }
    };
  }
};

/**
 * Validate required fields
 */
export const validateRequired = (data, fields, context = '') => {
  const errors = [];
  
  for (const field of fields) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field} is required. ${context}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting for API calls
 */
export const createRateLimiter = (maxCalls = 10, windowMs = 60000) => {
  const calls = [];
  
  return {
    isAllowed: () => {
      const now = Date.now();
      // Remove old calls outside the window
      while (calls.length > 0 && calls[0] < now - windowMs) {
        calls.shift();
      }
      
      if (calls.length < maxCalls) {
        calls.push(now);
        return true;
      }
      
      return false;
    },
    
    getRemainingCalls: () => maxCalls - calls.length
  };
};
