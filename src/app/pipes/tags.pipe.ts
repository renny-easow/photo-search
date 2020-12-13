import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tags'
})
export class TagsPipe implements PipeTransform {

  transform(value: string): string {
    return value.split(' ').join(', ');
  }

}
