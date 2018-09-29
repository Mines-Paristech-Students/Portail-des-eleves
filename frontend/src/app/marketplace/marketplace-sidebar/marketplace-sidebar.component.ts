import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";

@Component({
  selector: 'marketplace-sidebar',
  templateUrl: './marketplace-sidebar.component.html',
  styleUrls: ['./marketplace-sidebar.component.scss']
})
export class MarketplaceSidebarComponent implements OnInit {

    @Input() marketplace: any ;
    @Input() numberOfItems: number;
    @Input() showBalance = false;

    balance: any ;

    constructor(private api: ApiService) { }

    ngOnInit() {
        if(this.showBalance){
            this.api.get(`rest/marketplace/${this.marketplace.id}/balance/`).subscribe(
                // @ts-ignore
                res => this.balance = res.balance
            )
        }
    }

}
