import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-frozen-table',
  templateUrl: './frozen-table.component.html',
  styleUrls: ['./frozen-table.component.scss']
})
export class FrozenTableComponent implements OnInit {
  dataSource: User[];
  data: User[];
  totalRecords: number;
  loading: boolean;
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

  constructor(private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.frozenCols = [
      { field: 'index', header: 'Index' },
      { field: 'name', header: 'Name' }
    ];
    this.scrollableCols = [
      { field: 'age', header: 'Age' },
      { field: 'company', header: 'Company' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'address', header: 'Address' },
    ];
    this.table.sortField = this.frozenCols[0].field;
    this.usersService.getUsers().subscribe((data: User[]) => {
      this.dataSource = data;
      this.totalRecords = this.dataSource.length;
      this.onLazyLoad(this.table.createLazyLoadMetadata());
    });
    this.loading = true;
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
    return (<User>item).index;
  }

  onLazyLoad(event: LazyLoadEvent) {
    console.log(event);
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
