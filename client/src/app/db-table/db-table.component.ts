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

  loading2 = false;

  constructor(private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.frozenCols = [
      { field: 'id', header: 'Id' },
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
    this.user = this.cloneUser(<User>event.data);
    this.display = true;
  }

  cloneUser(user: User): User {
    const clonedUser = {};
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

  onShow(): void {
    console.log('onShow');
  }

  onHide(): void {
    console.log('onHide');
  }

  delete() {
    let indexOf = this.dataSource.indexOf(this.selectedUser);
    this.dataSource = this.dataSource.filter((value, index) => index !== indexOf);

    indexOf = this.data.indexOf(this.selectedUser);
    this.data = this.data.filter((value, index) => index !== indexOf);

    this.user = null;
    this.display = false;
  }

  add() {
    this.newUser = true;
    this.user = <User>{};
    this.display = true;
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
