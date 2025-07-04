export class CryptoService {
  // Generate a random encryption key
  async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )
  }

  // Encrypt file data
  async encryptFile(file: File, key: CryptoKey): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
    const fileData = await file.arrayBuffer()
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileData,
    )

    return { encryptedData, iv }
  }

  // Decrypt file data
  async decryptFile(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData,
    )
  }

  // Export key to store with patient
  async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await window.crypto.subtle.exportKey("raw", key)
  }

  // Import key from stored data
  async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      "raw",
      keyData,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )
  }
}

export const cryptoService = new CryptoService()
