import { Component } from '@angular/core';

import { ConferenceDetailComponent } from './components/conference-detail/conference-detail';
import { ConferenceList } from './components/conference-list/conference-list';

@Component({

  selector: 'app-root',

  standalone: true,

  imports: [ConferenceDetailComponent, ConferenceList],

  templateUrl: './app.html',

  styleUrl: './app.css'

})

export class App {

}
