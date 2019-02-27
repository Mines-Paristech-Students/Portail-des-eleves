import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {Subject, Subscription} from "rxjs";


@Directive({
    selector: '[appDebounceChange]'
})
export class DebounceChangeDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 500;
    @Output() debounceChange = new EventEmitter();
    private changes = new Subject();
    private subscription: Subscription;

    constructor() {
    }

    ngOnInit() {
        this.subscription = this.changes.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceChange.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('keyup', ['$event'])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.changes.next(event);
    }
}
