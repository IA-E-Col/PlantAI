import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, fieldName: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    
    const searchLower = searchText.toLowerCase();
    return items.filter(item => {
      const fieldValue = item[fieldName];
      return fieldValue && fieldValue.toLowerCase().includes(searchLower);
    });
  }
}
