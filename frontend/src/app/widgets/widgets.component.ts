import { Component, OnInit, Input } from '@angular/core';
import { WidgetPollComponent } from './poll/poll.component';
import { WidgetBirthdaysComponent } from './birthdays/birthdays.component';
import { WidgetChatComponent } from './chat/chat.component';

@Component({
  selector: 'widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

    widgets =  widgets

    @Input() widgets_status: {"name": string, "displayed": boolean}[];

    constructor() {
    }

    ngOnInit() {
    }

	should_display_widget(widg_name: string){
		for (let i = 0; i < this.widgets_status.length; i++) {
			const el = this.widgets_status[i];
			if (el.name === widg_name){
				return el.displayed
			}
		}
		return true
    }

}

let widgets = [
	{
		'name': 'chat',
		'display_name': 'Chat',
		'class': WidgetChatComponent
	},
	{
		'name': 'poll',
		'display_name': 'Sondages',
		'class': WidgetPollComponent,
	},
	{
		'name': 'birthdays',
		'display_name': 'Anniversaires',
		'class': WidgetBirthdaysComponent
	}
]
export default widgets;
