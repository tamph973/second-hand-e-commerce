/**
 * Validation related constants
 */

export const REGEX = {
	EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	PHONE: /^84\d{9}$/,
	PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
	NAME: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
};

export const VALIDATION = {
	PASSWORD_MIN_LENGTH: 8,
	EMAIL_MIN_LENGTH: 6,
	EMAIL_MAX_LENGTH: 30,
	NAME_MIN_LENGTH: 2,
	NAME_MAX_LENGTH: 50,
	PHONE_LENGTH: 11,
};
