/**
 * Payment Validation Utilities
 * Comprehensive validation for payment forms and data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PaymentFormData {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod: 'mpesa' | 'paypal' | 'paybill';
  amount: number;
  currency: string;
  mpesaPhone?: string;
  paybillPhone?: string;
}

// Phone number validation for M-Pesa
export const validateMpesaPhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!phone) {
    errors.push('Phone number is required for M-Pesa payments');
    return { isValid: false, errors, warnings };
  }

  // Remove any spaces or special characters for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Check format: should be 254XXXXXXXXX (12 digits total)
  const phoneRegex = /^254[0-9]{9}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    if (cleanPhone.startsWith('0')) {
      errors.push('Please use international format: 254XXXXXXXXX (not 0XXXXXXXXX)');
    } else if (cleanPhone.startsWith('+254')) {
      errors.push('Please remove the + sign: use 254XXXXXXXXX');
    } else if (cleanPhone.length < 12) {
      errors.push('Phone number is too short. Use format: 254XXXXXXXXX');
    } else if (cleanPhone.length > 12) {
      errors.push('Phone number is too long. Use format: 254XXXXXXXXX');
    } else if (!cleanPhone.startsWith('254')) {
      errors.push('Phone number must start with 254 (Kenya country code)');
    } else {
      errors.push('Invalid phone number format. Use: 254XXXXXXXXX');
    }
  }

  // Check if it's a valid Kenyan mobile network
  const networkPrefixes = ['254701', '254702', '254703', '254704', '254705', '254706', '254707', '254708', '254709', '254710', '254711', '254712', '254713', '254714', '254715', '254716', '254717', '254718', '254719', '254720', '254721', '254722', '254723', '254724', '254725', '254726', '254727', '254728', '254729'];
  const prefix = cleanPhone.substring(0, 6);
  
  if (!networkPrefixes.some(p => prefix.startsWith(p.substring(0, 6)))) {
    warnings.push('Please verify this is a valid Kenyan mobile number');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!email) {
    errors.push('Email address is required');
    return { isValid: false, errors, warnings };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && !commonDomains.includes(domain)) {
    warnings.push('Please double-check your email domain');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Amount validation
export const validateAmount = (amount: number, currency: string = 'KES'): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!amount || amount <= 0) {
    errors.push('Amount must be greater than zero');
    return { isValid: false, errors, warnings };
  }

  // Currency-specific validation
  if (currency === 'KES') {
    if (amount < 1) {
      errors.push('Minimum amount is KES 1');
    }
    if (amount > 70000) {
      errors.push('Maximum amount is KES 70,000 for M-Pesa transactions');
    }
    if (amount > 50000) {
      warnings.push('Large amounts may require additional verification');
    }
  } else if (currency === 'USD') {
    if (amount < 1) {
      errors.push('Minimum amount is $1');
    }
    if (amount > 10000) {
      warnings.push('Large amounts may require additional verification');
    }
  }

  // Check for reasonable decimal places
  if (amount.toString().includes('.') && amount.toString().split('.')[1].length > 2) {
    warnings.push('Amount will be rounded to 2 decimal places');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
    return { isValid: false, errors, warnings };
  }

  if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (name.trim().length > 100) {
    errors.push('Name is too long (maximum 100 characters)');
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(name)) {
    errors.push('Name contains invalid characters');
  }

  // Check if it looks like a full name
  if (!name.includes(' ')) {
    warnings.push('Please provide your full name (first and last name)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Comprehensive form validation
export const validatePaymentForm = (formData: PaymentFormData): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate customer info
  const nameValidation = validateName(formData.customerInfo.name);
  allErrors.push(...nameValidation.errors);
  allWarnings.push(...nameValidation.warnings);

  const emailValidation = validateEmail(formData.customerInfo.email);
  allErrors.push(...emailValidation.errors);
  allWarnings.push(...emailValidation.warnings);

  // Validate amount
  const amountValidation = validateAmount(formData.amount, formData.currency);
  allErrors.push(...amountValidation.errors);
  allWarnings.push(...amountValidation.warnings);

  // Payment method specific validation
  if (formData.paymentMethod === 'mpesa' && formData.mpesaPhone) {
    const phoneValidation = validateMpesaPhone(formData.mpesaPhone);
    allErrors.push(...phoneValidation.errors);
    allWarnings.push(...phoneValidation.warnings);
  }

  if (formData.paymentMethod === 'paybill' && formData.paybillPhone) {
    const phoneValidation = validateMpesaPhone(formData.paybillPhone);
    allErrors.push(...phoneValidation.errors);
    allWarnings.push(...phoneValidation.warnings);
  }

  // Optional phone validation for customer info
  if (formData.customerInfo.phone) {
    const phoneValidation = validateMpesaPhone(formData.customerInfo.phone);
    if (phoneValidation.errors.length > 0) {
      allWarnings.push('Customer phone number format may be incorrect');
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  }
  return phone;
};

// Clean phone number for API submission
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)\+]/g, '');
};

// Validate payment method availability
export const validatePaymentMethodAvailability = (method: string, currency: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (method === 'mpesa' && currency !== 'KES') {
    errors.push('M-Pesa only supports KES currency');
  }

  if (method === 'paypal' && !['USD', 'EUR', 'GBP', 'KES'].includes(currency)) {
    warnings.push('PayPal may not support this currency');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Generate validation summary
export const getValidationSummary = (validation: ValidationResult): string => {
  if (validation.isValid) {
    return validation.warnings.length > 0 
      ? `Valid with ${validation.warnings.length} warning(s)`
      : 'All validations passed';
  }
  
  return `${validation.errors.length} error(s) found`;
};