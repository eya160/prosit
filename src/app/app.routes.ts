import { Routes } from '@angular/router';
import { ConferenceList } from './components/conference-list/conference-list';
import { AddConferenceComponent } from './components/add-conference/add-conference';
import { EditConferenceComponent } from './components/edit-conference/edit-conference';

export const routes: Routes = [
    { path: '', component: ConferenceList },
    { path: 'add', component: AddConferenceComponent },
    { path: 'edit/:id', component: EditConferenceComponent }
];
