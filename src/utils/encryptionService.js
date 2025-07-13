import CryptoJS from 'crypto-js';

const encryptionService = {
  // Generate a random encryption key
  generateKey() {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  },

  // Encrypt file data with AES
  encryptFile(fileData, encryptionKey) {
    try {
      const encrypted = CryptoJS.AES.encrypt(fileData, encryptionKey).toString();
      return { success: true, data: encrypted };
    } catch (error) {
      return { success: false, error: 'Failed to encrypt file' };
    }
  },

  // Decrypt file data with AES
  decryptFile(encryptedData, encryptionKey) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Invalid decryption key or corrupted data');
      }
      
      return { success: true, data: decryptedString };
    } catch (error) {
      return { success: false, error: 'Failed to decrypt file: Invalid key or corrupted data' };
    }
  },

  // Encrypt a file object (convert to base64 first)
  async encryptFileObject(file, encryptionKey) {
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Encrypt the base64 data
      const encrypted = CryptoJS.AES.encrypt(base64, encryptionKey).toString();
      
      return { success: true, data: encrypted };
    } catch (error) {
      return { success: false, error: 'Failed to encrypt file object' };
    }
  },

  // Decrypt file object and convert back to blob
  async decryptFileObject(encryptedData, encryptionKey, mimeType) {
    try {
      // Decrypt to get base64
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const base64 = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!base64) {
        throw new Error('Invalid decryption key or corrupted data');
      }

      // Convert base64 back to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      return { success: true, data: blob };
    } catch (error) {
      return { success: false, error: 'Failed to decrypt file object: Invalid key or corrupted data' };
    }
  },

  // Generate file hash for integrity checking
  async generateFileHash(file) {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return { success: true, data: hashHex };
    } catch (error) {
      return { success: false, error: 'Failed to generate file hash' };
    }
  },

  // Verify file integrity
  async verifyFileIntegrity(file, expectedHash) {
    try {
      const result = await this.generateFileHash(file);
      if (!result.success) {
        return result;
      }

      const isValid = result.data === expectedHash;
      return { success: true, data: isValid };
    } catch (error) {
      return { success: false, error: 'Failed to verify file integrity' };
    }
  },

  // Encrypt user's master key with a password
  encryptMasterKey(masterKey, password) {
    try {
      const encrypted = CryptoJS.AES.encrypt(masterKey, password).toString();
      return { success: true, data: encrypted };
    } catch (error) {
      return { success: false, error: 'Failed to encrypt master key' };
    }
  },

  // Decrypt user's master key with a password
  decryptMasterKey(encryptedMasterKey, password) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedMasterKey, password);
      const masterKey = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!masterKey) {
        throw new Error('Invalid password');
      }
      
      return { success: true, data: masterKey };
    } catch (error) {
      return { success: false, error: 'Failed to decrypt master key: Invalid password' };
    }
  }
};

export default encryptionService;