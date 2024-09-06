import { Component } from '@angular/core';
import { ActivityComponent } from './activity/activity.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ActivityComponent],
  template: '<app-activity></app-activity>',
})
export class AppComponent { }