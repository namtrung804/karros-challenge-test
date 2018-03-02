import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'LocaleDate'})
export class LocaleDatePipe implements PipeTransform {
    transform(value: string, args: any): any {
        const UpdatedTime = new Date(value);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: args[0]
        };
        const offsetTimeZone = UpdatedTime.getTimezoneOffset() / 60;
        const signTimZone = offsetTimeZone > 0 ? '-' : '+';
        return UpdatedTime.toLocaleDateString(args[1], options) + signTimZone + Math.abs(offsetTimeZone);
    }
}
