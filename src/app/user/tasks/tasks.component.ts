import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_api/api.service';
import { Zadanie } from 'src/app/_models/task';


export interface TasksForProject {
  position: number;
  name: string;
  description: string;
  createdAt: string;
  endTo: string;
}

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

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  projectName: string | null | undefined;
  projectId: string | null | undefined;

  ELEMENT_DATA: TasksForProject[] = [];

  constructor(public dialog: MatDialog, private router: Router, private activeRoute: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.projectName =  this.activeRoute.snapshot.paramMap.get('data');
    this.projectId =  this.activeRoute.snapshot.paramMap.get('id');
    this.api.getTaskForProjects(this.projectId).subscribe(data => {
      this.ELEMENT_DATA = data
      console.log(this.ELEMENT_DATA)
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    })
    console.log(this.ELEMENT_DATA)
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

  displayedColumns: string[] = ['name', 'description', 'createdAt', 'endTo','edit', 'delete'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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
            let zad: Zadanie = {
              nazwa: this.taskDetails.name,
              opis: this.taskDetails.description
            }
            this.api.addTaskForProjects(this.projectId,zad).subscribe(data =>{
              this.api.getTaskForProjects(this.projectId).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              })
            })
          }
      }
  })
  }

  deleteTask(data: any) {
    this.selectedTaskName = data.nazwa
    let dialogRef = this.dialog.open(this.deleteElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
            this.api.deleteTask(data.id).subscribe(data => {
              this.api.getTaskForProjects(this.projectId).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              })
            })
            
          }
      }
  })
  }

}
