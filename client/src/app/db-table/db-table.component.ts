import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { SortMeta } from 'primeng/components/common/sortmeta';
import { Table } from 'primeng/table';
import { HttpParams } from '@angular/common/http';
import { ApiData } from '../api-data';

@Component({
  selector: 'app-db-table',
  templateUrl: './db-table.component.html',
  styleUrls: ['./db-table.component.scss']
})
export class DbTableComponent implements OnInit {
  dataSource: User[];
  data: User[];
  totalRecords: number;
  loading = true;
  frozenCols: any[];
  scrollableCols: any[];
  sortField: string;
  frozenColWidth = 300;

  @ViewChild(Table)
  table: Table;

  display = false;
  newUser = false;
  selectedUser: User;
  user: User;

  filterRowHeight = 50;

  constructor(private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.frozenCols = [
      { field: 'id', header: 'Id', filterMatchMode: 'equals' },
      { field: 'name', header: 'Name' }
    ];
    this.scrollableCols = [
      { field: 'age', header: 'Age' },
      { field: 'company', header: 'Company' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'address', header: 'Address' },
    ];
    // this.table.sortField = this.frozenCols[0].field;
    this.table.multiSortMeta = [<SortMeta>{ field: this.frozenCols[0].field, order: 1 }];
  }

  onRowSelect(event) {
    this.newUser = false;
    const user = (<User>event.data);
    this.user = this.cloneUser(user);
    this.display = true;
  }

  add() {
    this.newUser = true;
    this.user = <User>{};
    this.display = true;
  }

  cloneUser(user: User): User {
    const clonedUser = <User>{};
    for (const prop in user) {
      if (user.hasOwnProperty(prop)) {
        clonedUser[prop] = user[prop];
      }
    }
    return <User>clonedUser;
  }

  save() {
    if (this.newUser) {
      this.dataSource.push(this.user);
    } else {
      let users = [...this.dataSource];
      users[this.dataSource.indexOf(this.selectedUser)] = this.user;
      this.dataSource = users;

      users = [...this.data];
      users[this.data.indexOf(this.selectedUser)] = this.user;
      this.data = users;
    }

    this.user = null;
    this.display = false;
  }

  delete() {
    this.usersService.delete(this.selectedUser.id).subscribe((user: User) => {
      const i = this.data.findIndex((value: User, index: number, obj: User[]) => {
        return value.id === this.selectedUser.id;
      });
      this.data.splice(i, 1);
      this.user = null;
      this.display = false;
    });
  }

  onShow(): void {
    console.log('onShow');
  }

  onHide(): void {
    console.log('onHide');
  }

  getFrozenWidth(): string {
    return (this.frozenColWidth * this.frozenCols.length) + 'px';
  }

  rowTrackBy(index: number, item: any) {
    return (<User>item).id;
  }

  onLazyLoad(event: LazyLoadEvent) {
    if (this.data && this.loading) {
      return;
    }
    console.log(event);
    this.loading = true;
    this.usersService.getApiUsers(event).subscribe((apiData: ApiData<User>) => {
      this.data = apiData.data;
      this.totalRecords = apiData.totalRecords;
      this.loading = false;
    });
  }
}
