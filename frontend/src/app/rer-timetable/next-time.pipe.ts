import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'waitTime'
})
export class WaitTimePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let next_time = null;
        const now = Date.now() ;

        for(let time of value.timetable){
            if(next_time == null || time.time < next_time){
                next_time = time.time
            }
        }

        return next_time - now
    }

}
