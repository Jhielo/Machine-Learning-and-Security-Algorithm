import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from './encryption.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Encryption/Decryption App</h1>
      
      <div class="mb-4">
        <textarea [(ngModel)]="inputText" placeholder="Enter text to encrypt/decrypt" 
                  class="w-full p-2 border rounded" rows="4"></textarea>
      </div>
      
      <div class="flex space-x-2 mb-4">
        <button (click)="encrypt()" class="bg-blue-500 text-white px-4 py-2 rounded">Encrypt</button>
        <button (click)="decrypt()" class="bg-green-500 text-white px-4 py-2 rounded">Decrypt</button>
      </div>
      
      <div *ngIf="outputText" class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Result:</h2>
        <textarea [value]="outputText" readonly class="w-full p-2 border rounded" rows="4"></textarea>
      </div>
      
      <div *ngIf="key" class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Key:</h2>
        <input [value]="key" readonly class="w-full p-2 border rounded">
      </div>
    </div>
  `,
})
export class AppComponent {
  inputText = '';
  outputText = '';
  key = '';

  constructor(private encryptionService: EncryptionService) {}

  encrypt() {
    const result = this.encryptionService.encrypt(this.inputText);
    this.outputText = result.ciphertext;
    this.key = result.key;
  }

  decrypt() {
    if (!this.key) {
      alert('Please encrypt a message first to generate a key.');
      return;
    }
    this.outputText = this.encryptionService.decrypt(this.inputText, this.key);
  }
}