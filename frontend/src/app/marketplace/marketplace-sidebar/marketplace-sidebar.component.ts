import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'marketplace-sidebar',
  templateUrl: './marketplace-sidebar.component.html',
  styleUrls: ['./marketplace-sidebar.component.scss']
})
export class MarketplaceSidebarComponent implements OnInit {

  @Input() pages: any ;
  @Input() active_page: any ;

  constructor() { }

  ngOnInit() {
  }

}
