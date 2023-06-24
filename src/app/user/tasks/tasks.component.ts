import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/_api/api.service';
import { Zadanie } from 'src/app/_models/task';


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
  token: string = ''

  ELEMENT_DATA: Task[] = [];

  constructor(public dialog: MatDialog, private router: Router, private activeRoute: ActivatedRoute, private api: ApiService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.token = this.cookieService.get('userToken');
    this.projectName =  this.activeRoute.snapshot.paramMap.get('data');
    this.projectId =  this.activeRoute.snapshot.paramMap.get('id');
    this.api.getTaskForProjects(this.projectId, this.token).subscribe(data => {
      this.ELEMENT_DATA = data
      console.log(this.ELEMENT_DATA)
      this.dataSource = this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
      this.length = this.ELEMENT_DATA.length //new MatTableDataSource(this.ELEMENT_DATA);
    })
    console.log(this.ELEMENT_DATA)
    this.dataSource.sort = this.sort;
  }
  sliceIntoChunks(arr: any, chunkSize:any) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

  // paginator var and event
  length = 50;
  pageSize = 5;
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
    this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, e.pageSize)[e.pageIndex]);
  }

  displayedColumns: string[] = ['name', 'description','createdAt','endTo','edit', 'delete'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selectedTaskName = ''
  taskDetails!: Zadanie;


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
      name: '',
      description: '',
      createdDate: '',
      endToDate: ''
    }
    const dataCzasUtworzenia: Date = new Date();
    const formattedDataCzasUtworzenia: string = formatDate(dataCzasUtworzenia, 'yyyy-MM-dd HH:mm:ss.SSS', 'pl');
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            let zad: Zadanie = {
              name: this.taskDetails.name,
              description: this.taskDetails.description,
              createdDate: formattedDataCzasUtworzenia,
              endToDate: formatDate(this.taskDetails.endToDate!, 'yyyy-MM-dd HH:mm:ss.SSS', 'pl')
            }
            this.api.addTaskForProjects(this.projectId,zad, this.token).subscribe(data =>{
              this.api.getTaskForProjects(this.projectId, this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
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
            this.api.deleteTask(this.projectId, data.id, this.token).subscribe(data => {
              this.api.getTaskForProjects(this.projectId, this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
              })
            })
            
          }
      }
  })
  }

}
