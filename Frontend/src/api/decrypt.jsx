import CryptoJS from "crypto-js";

export function decrypt(encryptedValue) {
    const ENCRYPTION_KEY = 'mi_clave_super_segura';
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue;
    } catch (error) {
      console.error('Error al desencriptar el valor', error);
      return null;
    }
}


export function encrypt(value) {
  const ENCRYPTION_KEY = 'mi_clave_super_segura';
  try {
    const encryp = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
    return encryp;
  } catch (error) {
    console.error('Error al desencriptar el valor', error);
    return null;
  }
}
