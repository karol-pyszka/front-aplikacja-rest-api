import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

export interface ProjectElement {
  position: number;
  name: string;
  description: string;
  createdAt: string;
  endTo: string;
}

const ELEMENT_DATA: ProjectElement[] = [
  {position: 1, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 2, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 3, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 4, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 5, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 6, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 7, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['position', 'name', 'description', 'createdAt', 'endTo', 'showTask','edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
