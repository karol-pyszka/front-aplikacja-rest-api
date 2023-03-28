import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';


export interface TasksForProject {
  position: number;
  name: string;
  description: string;
  createdAt: string;
  endTo: string;
}

const ELEMENT_DATA: TasksForProject[] = [
  {position: 1, name: 'Projekt testowy', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 2, name: 'Projekt testowy2', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 3, name: 'Projekt testowy3', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 4, name: 'Projekt testowy4', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 5, name: 'Projekt testowy5', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 6, name: 'Projekt testowy6', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
  {position: 7, name: 'Projekt testowy7', description: 'opis projektu', createdAt: '2020-04-25', endTo: '2020-04-26' },
];





@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild('deleteElementDialog')
  deleteElementDialog!: TemplateRef<any>;

  @ViewChild('editElementDialog')
  editElementDialog!: TemplateRef<any>;

  @ViewChild('addElementDialog')
  addElementDialog!: TemplateRef<any>;

  projectName: string | null | undefined;

  constructor(public dialog: MatDialog, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.projectName =  this.activeRoute.snapshot.paramMap.get('data');
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

  displayedColumns: string[] = ['position', 'name', 'description', 'createdAt', 'endTo','edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedTaskName = ''
  taskDetails!: TasksForProject;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTask(data: any) {
    this.taskDetails = data
    let dialogRef = this.dialog.open(this.editElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {
          if (result === true) {
            console.log(this.taskDetails)
          }
      }
  })
  }


  addNewTask(){
    let dialogRef = this.dialog.open(this.addElementDialog);
    this.taskDetails = {
      position: 1,
      name: '',
      description: '',
      createdAt: '',
      endTo: ''
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            console.log(this.taskDetails)
          }
      }
  })
  }

  deleteTask(data: any) {
    this.selectedTaskName = data.name
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
