import { Component, OnInit } from '@angular/core';
import { WidgetPollComponent } from './poll/poll.component';
import { AbstractWidget } from './abstractwidget.component';
import { WidgetChatComponent } from './chat/chat.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  widgets: Map<string, typeof AbstractWidget> = new Map([
    ['chat', WidgetChatComponent],
    ['poll', WidgetPollComponent]
  ]);

  constructor(_apiService: ApiService) {
  }

  ngOnInit() {
  }

}
