import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators'

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnInit {

  news: Observable<{'id': number, 'title': string, 'association': string, 'text': string, 'date': string, 'author': string, 'formated_data'?: string }[]>
  p: number = 1;
  total: number;
  next_page: string;
  previous_page: string;
  loading: boolean;
  moment: any;

  @Input() asso_status: any;
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
    this.moment = require('moment')
    this.moment.locale('fr')
    this.loading = true;
    this.getPage(1)
  }

  getPage(page: number){
    this.news = this._apiService.get(`news/?page=${page}`).pipe(
      tap((res:any) => {
        this.total = res.count
        this.p = page
        this.next_page = res.next
        this.previous_page = res.previous
        this.loading = false
      }),
      map(res => {
        return res.results
      })
    )

/*
      (data:any) => {
        this.total = data.count
        this.next_page = data.next
        this.previous_page = data.previous
        this.loading = false;
        return data.results
      }*/
  }

}
