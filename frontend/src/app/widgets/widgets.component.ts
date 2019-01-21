import { Component, OnInit } from '@angular/core';
import { WidgetPollComponent } from './poll/poll.component';
import { AbstractWidget } from './abstractwidget.component';
import { WidgetBirthdaysComponent } from './birthdays/birthdays.component';
import { WidgetChatComponent } from './chat/chat.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  widgets: {'name': string, 'class': typeof AbstractWidget}[] = [
		{
			'name': 'chat',
			'class': WidgetChatComponent
		},
		{
			'name': 'poll',
			'class': WidgetPollComponent,
		},
		{
			'name': 'birthdays',
			'class': WidgetBirthdaysComponent
		}
	]

  constructor(_apiService: ApiService) {
  }

  ngOnInit() {
  }

}
