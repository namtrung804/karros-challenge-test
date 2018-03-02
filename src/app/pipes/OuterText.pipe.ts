import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'OuterText'})
export class OuterTextPipe implements PipeTransform {
    transform(value: string): any {
        const bodyHTML = document.createElement('p');
        bodyHTML.innerHTML = value;
        return bodyHTML.outerText;
    }
}