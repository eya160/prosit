import { Component, Input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Conference } from '../../models/conference';

@Component({
  selector: 'app-conference-detail',
  standalone: true,
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css'
})
export class ConferenceDetailComponent {

  @Input() conf: Conference | null = null;

}
