import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/components/common/sortevent';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {
  data: User[];
  totalRecords: number;

  constructor(private usersService: UsersService) {

  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((data: User[]) => {
      this.data = data;
      this.totalRecords = data.length;
    });
  }

  customSort(event: SortEvent) {
// do something clever...
  }
}
