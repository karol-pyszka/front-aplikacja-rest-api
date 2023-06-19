import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/_api/api.service';
import { Projekt } from 'src/app/_models/project';

export interface ProjectElement {
  position: number;
  name: string;
  description: string;
  createdAt: string;
  endTo: string;
}

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

  @ViewChild('assignDialog')
  assignDialog!: TemplateRef<any>;

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  ELEMENT_DATA: Projekt[] = []

  constructor(public dialog: MatDialog, private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getProjects().subscribe(data => {
      this.ELEMENT_DATA = data
      console.log(this.ELEMENT_DATA)
      this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
      this.length = this.ELEMENT_DATA.length
    })
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
  
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'endTo', 'showTask','edit', 'delete', 'assign'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selectedProjectName = ''
  projectDetails2!: Projekt;
  projectDetails!:ProjectElement;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // normal should pass uid if is
  showTask(element: any) {
    //console.log(element)
    //this.router.navigate(["tasks"], { state: { data: 'nazwa' } });
    this.router.navigate(['tasks', {data: element.nazwa, id:element.id}]);
  }

  editProject(data: any) {
    this.projectDetails2 = data
    console.log(data)
    let dialogRef = this.dialog.open(this.editElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            let proj: Projekt = {
              nazwa: this.projectDetails2.nazwa,
              opis: this.projectDetails2.opis
            }
            console.log(proj)
            console.log(data.id)
            this.api.editProject(data.id, proj).subscribe(data =>{
              this.api.getProjects().subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
              })
            })
            
      }
  }})
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
            let proj: Projekt = {
              nazwa: this.projectDetails.name,
              opis: this.projectDetails.description
            }
            this.api.addProject(proj).subscribe(data =>{
              this.api.getProjects().subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
              })
            })
            
      }
  }})}

  deleteProject(data: any) {
    this.selectedProjectName = data.nazwa
    let dialogRef = this.dialog.open(this.deleteElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
            this.api.deleteProject(data.id).subscribe(data => {
              this.api.getProjects().subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
              })
            })
            
          }
      }
  })
  }

  assignProject(data: any){
    this.selectedProjectName = data.nazwa
    let dialogRef = this.dialog.open(this.assignDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
            //this.api.deleteProject(data.id).subscribe(data => {
              this.api.getProjects().subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                this.length = this.ELEMENT_DATA.length
              })
           // })
            
          }
      }
  })
  }

}
