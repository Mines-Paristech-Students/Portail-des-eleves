import {Component, Input, OnInit} from '@angular/core';
import {GetRoleService} from "../../associations/get-role.service";

@Component({
  selector: 'library-sidebar',
  templateUrl: './library-sidebar.component.html',
  styleUrls: ['./library-sidebar.component.scss'],
  providers: [GetRoleService]
})
export class LibrarySidebarComponent implements OnInit {

  @Input() library: any ;

  constructor(private role: GetRoleService){}

  ngOnInit() {}
}
