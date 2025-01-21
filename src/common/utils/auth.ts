import crypto from 'crypto';

/**
 * Generate a secure temporary password
 * @param name - A unique identifier to enhance the password's uniqueness
 * @returns A temporary password
 */
export const generateTempPassword = (name: string): string => {
    const hashedName = crypto.createHash('sha256').update(name).digest('hex').slice(0, 8);
    const randomString = crypto.randomBytes(4).toString('hex');
    const timestamp = Date.now().toString().slice(-4);

    return `${hashedName}${randomString}${timestamp}`;
};
