import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ActivityComponent } from './activity/activity.component';
import { EncryptionService } from './encryption.service';

@NgModule({
  declarations: [AppComponent, ActivityComponent],
  imports: [BrowserModule, FormsModule],
  providers: [EncryptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }