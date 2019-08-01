import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

    user: any;
    questions: any;
    error: any;

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.api.get("users/" + id + "/").subscribe(
            user => this.user = user,
            error => {
                this.error = error;
                console.log(error)
            })

        this.api.get("profile/questions/" + id).subscribe(
            res => {
                this.questions = res["questions"];
                for (let question of this.questions) {
                    if (!question.answer) {
                        question.answer = {"text": ""};
                    }
                }
            },
            error => {
                this.error = error;
                console.log(error)
            });
    }

    onSubmit() {
        for (let question of this.questions) {
            console.log("question : " + question.text);
            if (!question.answer.id) {
                let answer = {
                    "text": question.answer.text,
                    "question": question.id
                };
                this.api.post("profile_answer/", answer).subscribe(
                    res => console.log(res),
                    res => console.log(res)
                );
            } else {
                this.api.patch(`profile_answer/${question.answer.id}/`, question.answer).subscribe(
                    res => console.log(res),
                    res => console.log(res)
                );
            }
        }

        this.api.put("users/" + this.user.id + "/", this.user).subscribe(
            _ => 0,
            err => this.error = err
        );
    }

}
