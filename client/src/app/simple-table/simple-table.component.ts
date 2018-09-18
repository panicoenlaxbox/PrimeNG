import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {
  dataSource: User[];
  data: User[];
  totalRecords: number;
  loading: boolean;

  @ViewChild(Table)
  table: Table;

  constructor(private usersService: UsersService) {

  }

  ngOnInit(): void {
    console.log('retrieving data');
    this.usersService.getUsers().subscribe((data: User[]) => {
      console.log('data available');
      this.dataSource = data;
      this.totalRecords = this.dataSource.length;
      this.onLazyLoad(this.table.createLazyLoadMetadata());
    });
    this.loading = true;
  }

  rowTrackBy(index: number, item: any) {
    return (<User>item).index;
  }

  onLazyLoad(event: LazyLoadEvent) {
    console.log('onLazyLoad', event);

    this.loading = true;

    setTimeout(() => {
      if (event.sortField) {
        this.dataSource = this.dataSource.sort((a: User, b: User) => {
          if (a[event.sortField] < b[event.sortField]) {
            return event.sortOrder === 1 ? -1 : 1;
          } else if (a[event.sortField] > b[event.sortField]) {
            return event.sortOrder === 1 ? 1 : -1;
          }
          return 0;
        });
      }
      this.data = this.dataSource.slice(event.first, event.first + event.rows);
      this.loading = false;
    }, 0);
  }
}
