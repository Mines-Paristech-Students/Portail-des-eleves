import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'library-sidebar',
  templateUrl: './library-sidebar.component.html',
  styleUrls: ['./library-sidebar.component.scss']
})
export class LibrarySidebarComponent implements OnInit {

  @Input() library: any ;

  ngOnInit() {}
}
