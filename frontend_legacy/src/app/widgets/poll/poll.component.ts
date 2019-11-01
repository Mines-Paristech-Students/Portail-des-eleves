import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstractwidget.component';
import { ApiService } from '../../api.service';
import { RequestCacheService} from '../../request-cache.service'

@Component({
    templateUrl: './poll.component.html',
    styleUrls: ['../widgets.component.scss']
})
export class WidgetPollComponent extends AbstractWidget implements OnInit {

    poll_title : string; // The poll title displayed at the top of the widget
    poll_id: number;     // The unique id of the poll being displayed (changes when going through history)
    is_poll_available: boolean; // Will be false when there is no poll at the specified date
    user_vote_id?: number; // The unique id referencing the choice the user has made on the poll being displayed
    choices: {'id': number, 'choice': string, 'vote_count'?: number}[]; // List of choices for the poll and the number of vote (if it's an old vote)
    total_vote_count?: number; // The total number of vote for the poll being displayed
    date: Date; // Displayed at the bottom of the widget and indicates the date at which the displayed poll has been published


    constructor(_apiService: ApiService, _cache: RequestCacheService) {
        super(_apiService, _cache);

        this.poll_title = "";
        this.poll_id = 0;
        this.is_poll_available = false;
        this.user_vote_id = 0;
        this.choices = [];
        this.date = new Date();
        this.date.setHours(0, 0, 0, 0)
    }


    ngOnInit() {
        this.reload_poll()
    }

    is_current_poll() {
        // If displayed poll is today's poll
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.date.valueOf() == today.valueOf()
    }

    previous() {
        // Display  the previous poll
        let last_fetched_date = new Date(this.date.getTime());
        last_fetched_date.setDate(this.date.getDate() - 1);
        this.date = last_fetched_date;
        this.reload_poll()
    }

    next() {
        // Display the next poll
        let last_fetched_date = new Date(this.date.getTime());
        last_fetched_date.setDate(this.date.getDate() + 1);
        this.date = last_fetched_date;
        this.reload_poll()
    }

    reload_poll(){
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if(this.date.valueOf() >= today.valueOf()){
            this.date = today
        }

        // Request poll data
        this._apiService.get(`polls/${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate()}/`).subscribe(
            (data:any) => {
                this.poll_title = data.question;
                this.poll_id = data.id;
                this.user_vote_id = data.user_vote;
                this.is_poll_available = true;
                this.choices = data.choices.map(
                    (item:{"text": string, "poll": number}) => {
                        return {
                            'choice': item['text'],
                            'id': item['id']
                        }
                });
                // Reload poll results
                this.reload_vote()
            },
            (err) => {
                this.poll_title = "";
                this.is_poll_available = false;
                this.choices = null
            }
        );

    }

    reload_vote(){
        if(this.is_current_poll()){
            // No vote to fetch for current poll
            return
        }
        this._apiService.get(`polls/votes/${this.poll_id}/`).subscribe(
            (data:{"results": {"choice_id": number, "vote_count": number}[]}) => {
                this.total_vote_count = 0;
                for (let i = 0; i < this.choices.length; i++) {
                    const c = this.choices[i];
                    for (let j = 0; j < data.results.length; j++){
                        const r = data.results[j];
                        if(c.id == r.choice_id){
                            c.vote_count = r.vote_count;
                            this.total_vote_count += r.vote_count
                        }
                    }
                }
                this.total_vote_count = Math.max(this.total_vote_count, 1)
            }
        )
    }

    vote_for_poll(choice_id: number){
        this._apiService.post("polls/votes/", {"choice": choice_id}).subscribe(
            _ => {
                this.user_vote_id = choice_id;
                this._cache.remove(`polls/${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate()}/`)
            },
            err => {
                console.log(err)
            }
        )
    }

}
