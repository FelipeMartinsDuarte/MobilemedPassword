'use server';

/**
 * @fileOverview Generates a random password based on the selected difficulty level.
 *
 * - generatePassword - A function that generates a password.
 * - GeneratePasswordInput - The input type for the generatePassword function.
 * - GeneratePasswordOutput - The return type for the generatePassword function.
 */

import { z } from 'zod';

const GeneratePasswordInputSchema = z.object({
  prefix: z.string().default('Mobile').describe('The prefix for the password.'),
  length: z.number().min(4).max(20).default(8).describe('The desired length of the password after the prefix.'),
  includeSpecialChars: z.boolean().default(true).describe('Whether to include special characters in the password.'),
  onlyUppercase: z.boolean().default(false).describe('Whether to generate password with only uppercase letters.'),
});
export type GeneratePasswordInput = z.infer<typeof GeneratePasswordInputSchema>;

const GeneratePasswordOutputSchema = z.object({
  password: z.string().describe('The generated password.'),
});
export type GeneratePasswordOutput = z.infer<typeof GeneratePasswordOutputSchema>;

export async function generatePassword(input: GeneratePasswordInput): Promise<GeneratePasswordOutput> {
  const { prefix, length, includeSpecialChars, onlyUppercase } = GeneratePasswordInputSchema.parse(input);

  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '$*&@#';

  let charSet = '';
  const passwordChars = [];

  if (onlyUppercase) {
    charSet = upperCaseChars;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      passwordChars.push(charSet[randomIndex]);
    }
  } else {
    charSet = lowerCaseChars + upperCaseChars + numberChars;
  
    // Ensure at least one character of each type
    passwordChars.push(lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]);
    passwordChars.push(upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]);
    passwordChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    
    if (includeSpecialChars) {
      charSet += specialChars;
      passwordChars.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
    }
  
    // Fill the rest of the password length with random characters from the full set
    for (let i = passwordChars.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      passwordChars.push(charSet[randomIndex]);
    }
  }
  
  // Shuffle the array to ensure randomness of character positions
  const shuffledPassword = passwordChars
    .sort(() => Math.random() - 0.5)
    .join('');
  
  const finalPrefix = prefix.trim() === '' ? 'Mobile' : prefix.trim();

  return Promise.resolve({ password: `${finalPrefix}@${shuffledPassword}` });
}
