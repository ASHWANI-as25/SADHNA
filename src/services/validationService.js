// Validation utilities
export const validate = {
  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  url: (value) => {
    // URL is optional, only validate format if provided
    if (!value || value.trim() === '') {
      return null;
    }
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  },

  minLength: (value, min, fieldName) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) {
      return `${fieldName} cannot exceed ${max} characters`;
    }
    return null;
  },

  password: (value) => {
    if (!value || value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  },

  date: (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  },

  number: (value) => {
    if (isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    return null;
  },
};

// Batch validation
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Form field error helper
export const getFieldError = (errors, field) => {
  return errors[field] || null;
};

// Check if form has errors
export const hasFieldError = (errors, field) => {
  return !!errors[field];
};
