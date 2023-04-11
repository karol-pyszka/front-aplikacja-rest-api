import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

export interface ProjectElement {
  position: number;
  name: string;
  description: string;
  createdAt: string;
  endTo: string;
}

const ELEMENT_DATA: ProjectElement[] = [
  {position: 1, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 2, name: 'Projekt testowy2', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 3, name: 'Projekt testowy3', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 4, name: 'Projekt testowy4', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 5, name: 'Projekt testowy5', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 6, name: 'Projekt testowy6', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 7, name: 'Projekt testowy7', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
];

export const PROJECTS_DATA: ProjectElement[] = ELEMENT_DATA

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  
  @ViewChild('deleteElementDialog')
  deleteElementDialog!: TemplateRef<any>;

  @ViewChild('editElementDialog')
  editElementDialog!: TemplateRef<any>;

  @ViewChild('addElementDialog')
  addElementDialog!: TemplateRef<any>;

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  // paginator var and event
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;

  pageEvent: PageEvent | undefined;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  
  displayedColumns: string[] = ['position', 'name', 'description', 'createdAt', 'endTo', 'showTask','edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedProjectName = ''
  projectDetails!: ProjectElement;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // normal should pass uid if is
  showTask(element: any) {
    //console.log(element)
    //this.router.navigate(["tasks"], { state: { data: 'nazwa' } });
    this.router.navigate(['tasks', {data: element.name}]);
  }

  editProject(data: any) {
    this.projectDetails = data
    let dialogRef = this.dialog.open(this.editElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {
          if (result === true) {
            console.log(this.projectDetails)
          }
      }
  })
  }

  addNewProject(){
    let dialogRef = this.dialog.open(this.addElementDialog);
    this.projectDetails = {
      position: 1,
      name: '',
      description: '',
      createdAt: '',
      endTo: ''
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            console.log(this.projectDetails)
          }
      }
  })
  }

  deleteProject(data: any) {
    this.selectedProjectName = data.name
    let dialogRef = this.dialog.open(this.deleteElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === 'yes') {
              console.log('User clicked yes.');
          } else if (result === 'no') {
              console.log('User clicked no.');
          }
      }
  })
  }

}
