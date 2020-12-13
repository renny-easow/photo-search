import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'author'
})
export class AuthorPipe implements PipeTransform {
    private expressionToRemove = 'nobody@flickr.com ("';

    transform(value: string): string {
        if (value.indexOf(this.expressionToRemove) !== -1) {
            // Transform `nobody@flickr.com ("Author_Name")` to `Author_Name`
            return value.substring(this.expressionToRemove.length, value.length - 2);
        } else {
            return value;
        }
    }

}
