import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import bigInt from 'big-integer';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  getPrivateKey(): bigInt.BigInteger {
    throw new Error('Method not implemented.');
  }
  private prime: bigInt.BigInteger;
  private generator: bigInt.BigInteger;

  constructor() {
    // These should be agreed upon constants
    this.prime = bigInt("FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF", 16);
    this.generator = bigInt(2);
  }

  generatePrivateKey(): bigInt.BigInteger {
    return bigInt.randBetween(bigInt(1), this.prime.minus(1));
  }

  generatePublicKey(privateKey: bigInt.BigInteger): bigInt.BigInteger {
    return this.generator.modPow(privateKey, this.prime);
  }

  generateSharedSecret(privateKey: bigInt.BigInteger, otherPublicKey: bigInt.BigInteger): bigInt.BigInteger {
    return otherPublicKey.modPow(privateKey, this.prime);
  }

  private xorEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }

  encrypt(plaintext: string, sharedSecret: bigInt.BigInteger): string {
    const key = sharedSecret.toString(16);
    const ciphertext = this.xorEncrypt(plaintext, key);
    return btoa(ciphertext);
  }

  decrypt(ciphertext: string, sharedSecret: bigInt.BigInteger): string {
    const key = sharedSecret.toString(16);
    const decodedCiphertext = atob(ciphertext);
    return this.xorEncrypt(decodedCiphertext, key);
  }

  async encryptFile(file: File, sharedSecret: bigInt.BigInteger): Promise<Blob> {
    const text = await file.text();
    const encrypted = this.encrypt(text, sharedSecret);
    return new Blob([encrypted], { type: 'text/plain' });
  }

  async decryptFile(file: File, sharedSecret: bigInt.BigInteger): Promise<string> {
    const text = await file.text();
    return this.decrypt(text, sharedSecret);
  }
}