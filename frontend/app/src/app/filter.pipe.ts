import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchText: string, propertyName: string): any[] {
    if (!value || !searchText || !propertyName) {
      return value;
    }
    
    searchText = searchText.toLowerCase();
    return value.filter((item: any) => {
      const propertyValue = item[propertyName];
      console.log(propertyValue)
      if (typeof propertyValue === 'string' && propertyValue) {
        console.log(propertyValue)
        console.log(searchText)
        return propertyValue.toLowerCase().includes(searchText);
      }
      return false;
    });
  }
}