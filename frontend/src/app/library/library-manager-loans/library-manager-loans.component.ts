import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-library-manager-loans',
    templateUrl: './library-manager-loans.component.html',
    styleUrls: ['./library-manager-loans.component.scss']
})
export class LibraryManagerLoansComponent implements OnInit {

    loans: any;
    loanables: any;
    p = 1; // The current page

    library_id: any;
    library: any;
    error: any;

    inOneWeek = new Date();
    new_loan = {
        user: "",
        loanable: "",
        expected_return_date: "",
        status: ""
    };

    filter = {
        date: "",
        status: [],
        users: [],
    };

    users: any;

    status = [
        {value: "BORROWED", label: "Emprunté", color: "blue"},
        {value: "CANCELLED", label: "Annulé", color: "yellow"},
        {value: "RETURNED", label: "Rendu", color: "green"}
    ];

    constructor(private api: ApiService, private route: ActivatedRoute) {
        this.inOneWeek.setTime(this.inOneWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.new_loan.expected_return_date = (new DatePipe("fr-FR")).transform(this.inOneWeek, 'yyyy-MM-dd');
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                this.library_id = params['id'];

                this.api.get(`library/${this.library_id}/`).subscribe(
                    library => this.library = library,
                    error => this.error = error.message
                );

                this.loanables = this.api.get(`loanables/?library__id=${this.library_id}`);
                this.users = this.api.get('users/');
                this.filterOrders();
            });
    }

    filterOrders() {
        let url = `loans/?loanable__library__id=${this.library_id}`;

        if (this.filter.date) {
            // @ts-ignore
            url = url + `&loan_date=${this.filter.date.year}-${this.filter.date.month}-${this.filter.date.day}`;
        }

        if (this.filter.users.length > 0) {
            url = url + `&user__in=${this.filter.users.map(u => u.id).join(",")}`;
        }

        if (this.filter.status.length > 0) {
            url = url + `&status__in=${this.filter.status.map(s => s.value).join(",")}`;
        }

        this.loans = this.api.get(url);

    }

    updateStatus(loan, status) {
        loan.activity = "upload";
        loan.status = status.value;

        if (loan.status == "RETURNED") {
            loan.real_return_date = new Date();
        } else {
            loan.real_return_date = null;
        }

        this.api.patch(`loans/${loan.id}/`, {
            status: loan.status
        }).subscribe(
            _ => {
                loan.activity = "check";
                setTimeout(() => loan.activity = false, 1000)
            },
            err => this.error = err.message
        )
    }

    saveLoan() {
        let formatted_date = new Date();
        // @ts-ignore
        formatted_date.setFullYear(this.new_loan.expected_return_date.year);
        // @ts-ignore
        formatted_date.setMonth(this.new_loan.expected_return_date.month);
        // @ts-ignore
        formatted_date.setDate(this.new_loan.expected_return_date.day);

        if (this.new_loan.user != "" && formatted_date > new Date() && this.new_loan.loanable != "") {

            this.new_loan.status = "BORROWED";
            this.new_loan.expected_return_date = formatted_date.toISOString();

            this.api.post("loans/", this.new_loan).subscribe(
                res => {
                    this.filterOrders();
                    this.new_loan.user = "";
                    this.new_loan.loanable = "";
                    this.new_loan.expected_return_date = (new DatePipe("fr-FR")).transform(this.inOneWeek, 'yyyy-MM-dd');
                },
                err => this.error = err.message
            )
        }
    }
}

