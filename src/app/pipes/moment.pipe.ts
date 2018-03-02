import {Pipe, PipeTransform} from '@angular/core';
import {Moment} from "moment";

@Pipe({
  name: 'moment',
  pure: true
})
export class MomentPipe implements PipeTransform {
  transform(value: Moment, args: string = 'DD/MM/YYYY hh:mm:ss'): any {
    // console.log(value);
    if (!value) return value;
    else {
      if (value.year() < 2038)
        return value.format(args)
    }
  }
}
