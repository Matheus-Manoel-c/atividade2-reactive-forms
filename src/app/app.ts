import { Component, signal } from '@angular/core';
import { Agenda } from './agenda/agenda';

@Component({
  selector: 'app-root',
  imports: [Agenda],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atividade2-reactive-forms');
}
