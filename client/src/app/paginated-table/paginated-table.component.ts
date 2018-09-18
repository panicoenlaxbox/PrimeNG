import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FilterMetadata } from 'primeng/components/common/filtermetadata';
import { Table } from 'primeng/table';
import * as _ from 'lodash';

@Component({
  selector: 'app-paginated-table',
  templateUrl: './paginated-table.component.html',
  styleUrls: ['./paginated-table.component.scss']
})
export class PaginatedTableComponent implements OnInit {
  originalDataSource: User[];
  dataSource: User[];
  data: User[];
  totalRecords: number;
  loading: boolean;
  frozenCols: any[];
  scrollableCols: any[];
  sortField: string;
  frozenColWidth = 300;

  filterRowHeight = 50;
  ageFilter = null;

  ageTimeout: any;

  companies: { label: string, value: string }[];

  display = false;

  newUser = false;
  selectedUser: User;
  user: User;

  @ViewChild(Table)
  table: Table;

  rowExpandColWidth = 35;

  constructor(private usersService: UsersService) {

  }

  onRowExpand(event): void {
    console.log('onRowExpand');
    const mouseEvent = <MouseEvent>event.originalEvent;
    mouseEvent.stopPropagation();
  }

  onRowCollapse(event): void {
    console.log('onRowCollapse');
    const mouseEvent = <MouseEvent>event.originalEvent;
    mouseEvent.stopPropagation();
  }

  isFrozenCols(cols: any[]): boolean {
    return _.isEqual(this.frozenCols, cols);
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
    this.sortField = this.frozenCols[0].field;
    this.usersService.getUsers().subscribe((data: User[]) => {
      this.originalDataSource = data;
      this.dataSource = data;
      this.totalRecords = this.dataSource.length;
      this.companies = this.originalDataSource.map((value: User, index: number, array: User[]) => {
        return { label: value.company, value: value.company };
      });
      this.companies.unshift({ label: '', value: '' });
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
      this.originalDataSource.push(this.user);
      this.dataSource.push(this.user);
    } else {
      let users = [...this.originalDataSource];
      users[this.originalDataSource.indexOf(this.selectedUser)] = this.user;
      this.originalDataSource = users;
      users = [...this.dataSource];
      users[this.dataSource.indexOf(this.selectedUser)] = this.user;
      this.dataSource = users;
      users = [...this.data];
      users[this.data.indexOf(this.selectedUser)] = this.user;
      this.data = users;
    }

    this.user = null;
    this.display = false;
  }

  reset() {
    this.table.reset();
  }

  onAgeChange(event, dt: Table) {
    console.log(event);
    if (this.ageTimeout) {
      clearTimeout(this.ageTimeout);
    }

    this.ageTimeout = setTimeout(() => {
      dt.filter(event.value, 'age', 'gt');
    }, 250);
  }

  getFrozenWidth(): string {
    return ((this.frozenColWidth * this.frozenCols.length) + this.rowExpandColWidth) + 'px';
  }

  isEmptyObject(o): boolean {
    return Object.keys(o).length === 0;
  }

  sort(data: User[], sortField: string, sortOrder: number): User[] {
    return data.sort((a: User, b: User) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === 1 ? -1 : 1;
      } else if (a[sortField] > b[sortField]) {
        return sortOrder === 1 ? 1 : -1;
      }
      return 0;
    });
  }

  matchUserGlobalFilter(user: User, globalFilter: string): boolean {
    if (!globalFilter) {
      return true;
    }
    return user.id.toString().includes(globalFilter) ||
      user.name.includes(globalFilter) ||
      user.age.toString().includes(globalFilter) ||
      user.company.includes(globalFilter) ||
      user.email.includes(globalFilter) ||
      user.phone.includes(globalFilter) ||
      user.address.includes(globalFilter);
  }

  matchUserFilters(user: User, filters: { [s: string]: FilterMetadata }): boolean {
    let matchFilter = true;
    for (const key in filters) {
      if (key === 'global') {
        continue;
      }
      switch (key) {
        case 'id':
          if (user.id !== parseInt(filters[key].value, 10)) {
            matchFilter = false;
          }
          break;
        case 'age':
          if (user.age >= filters[key].value) {
            matchFilter = false;
          }
          break;
        case 'company':
          if (user.company !== filters[key].value) {
            matchFilter = false;
          }
          break;
      }
    }
    return matchFilter;
  }

  filter(data: User[], globalFilter: string, filters: { [s: string]: FilterMetadata; }): User[] {
    return data.filter((user: User) => {
      const matchGlobalFilter = this.matchUserGlobalFilter(user, globalFilter);
      const matchFilters = this.matchUserFilters(user, filters);
      return matchGlobalFilter && matchFilters;
    });
  }

  onLazyLoad(event: LazyLoadEvent) {
    console.log(event);
    this.loading = true;

    setTimeout(() => {
      if (event.globalFilter || !this.isEmptyObject(event.filters)) {
        this.dataSource = this.filter(this.originalDataSource, event.globalFilter, event.filters);
        this.totalRecords = this.dataSource.length;
      } else {
        this.dataSource = this.originalDataSource;
        this.totalRecords = this.originalDataSource.length;
      }
      if (event.sortField) {
        this.originalDataSource = this.sort(this.originalDataSource, event.sortField, event.sortOrder);
        this.dataSource = this.sort(this.dataSource, event.sortField, event.sortOrder);
      }
      this.data = this.dataSource.slice(event.first, event.first + event.rows);
      this.loading = false;
    }, 1000);
  }
}
