// Shared validation utilities for forms

export function validateEmail(email: string, required = true): string | undefined {
  if (!email) return required ? "Email is required" : undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return undefined;
}

export function validateUrl(url: string, required = false): string | undefined {
  if (!url) return required ? "URL is required" : undefined;
  try {
    // Accept only http/https URLs
    if (url && !/^https?:\/\/.+/.test(url)) {
      return "URL must start with http:// or https://";
    }
    new URL(url);
    return undefined;
  } catch {
    return "Please enter a valid URL";
  }
}

export function validateRequired(value: string, label = "This field"): string | undefined {
  if (!value || !value.trim()) return `${label} is required`;
  return undefined;
}

export function validateMinLength(value: string, min: number, label = "This field"): string | undefined {
  if (value && value.trim().length < min) return `${label} must be at least ${min} characters`;
  return undefined;
}

export function validateMaxLength(value: string, max: number, label = "This field"): string | undefined {
  if (value && value.trim().length > max) return `${label} must be less than ${max} characters`;
  return undefined;
}

export function validatePhone(phone: string, required = false): string | undefined {
  if (!phone) return required ? "Phone number is required" : undefined;
  if (phone && !/^\+?[\d\s-()]+$/.test(phone)) return "Invalid phone number format";
  return undefined;
} 