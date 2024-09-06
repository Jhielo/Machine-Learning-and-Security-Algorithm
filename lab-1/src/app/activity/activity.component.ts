import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../encryption.service';
import bigInt from 'big-integer';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  inputFile: File | null = null;
  outputText = '';
  privateKey: bigInt.BigInteger;
  publicKey: bigInt.BigInteger;
  sharedSecret: bigInt.BigInteger | null = null;

  constructor(private encryptionService: EncryptionService) {
    this.privateKey = this.encryptionService.generatePrivateKey();
    this.publicKey = this.encryptionService.generatePublicKey(this.privateKey);
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.inputFile = element.files[0];
    }
  }

  async generateSharedSecret(otherPublicKey: string) {
    const otherPublicKeyBigInt = bigInt(otherPublicKey);
    this.sharedSecret = this.encryptionService.generateSharedSecret(this.privateKey, otherPublicKeyBigInt);
  }

  async encrypt() {
    if (!this.inputFile || !this.sharedSecret) {
      alert('Please select a file and generate a shared secret first.');
      return;
    }

    try {
      const encryptedBlob = await this.encryptionService.encryptFile(this.inputFile, this.sharedSecret);
      this.downloadFile(encryptedBlob, 'encrypted.txt');
    } catch (error) {
      console.error('Encryption error:', error);
      alert('An error occurred during encryption.');
    }
  }

  async decrypt() {
    if (!this.inputFile || !this.sharedSecret) {
      alert('Please select a file and generate a shared secret first.');
      return;
    }

    try {
      const decryptedText = await this.encryptionService.decryptFile(this.inputFile, this.sharedSecret);
      this.outputText = decryptedText;
    } catch (error) {
      console.error('Decryption error:', error);
      alert('An error occurred during decryption.');
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getPublicKey(): string {
    return this.publicKey.toString();
  }
}