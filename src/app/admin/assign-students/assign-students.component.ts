import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/_api/api.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-assign-students',
  templateUrl: './assign-students.component.html',
  styleUrls: ['./assign-students.component.css']
})
export class AssignStudentsComponent implements OnInit {
  
  @ViewChild('deleteElementDialog')
  deleteElementDialog!: TemplateRef<any>;

  @ViewChild('editElementDialog')
  editElementDialog!: TemplateRef<any>;

  @ViewChild('addElementDialog')
  addElementDialog!: TemplateRef<any>;

  @ViewChild('selectProjectForStudent')
  selectProjectForStudent!: TemplateRef<any>;

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  projects: any = null;

  selectedProjects: number[] = [];
  token: any;

  ELEMENT_DATA: User[] = []

  constructor(public dialog: MatDialog, private router: Router, private api: ApiService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.token = this.cookieService.get('userToken');
    if(this.cookieService.check("userToken")){
      let jwtData = this.cookieService.get("userToken").split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
     // this.userRole = decodedJwtData.role
    }
    this.api.getProjects(this.token).subscribe( project => {
      this.projects = project
    });

    this.api.getAllUser(this.token).subscribe(data => {
      this.ELEMENT_DATA = data
      this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
      if(this.ELEMENT_DATA == null)
      {
        this.length = 0
      }
      else{
        this.length = this.ELEMENT_DATA.length
      }
      
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
  
  displayedColumns: string[] = [ 'name', 'surname', 'email', 'showTask', 'edit' ,'delete'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selectedProjectName = ''
  projectDetails!: User;


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
            let dataToSend = {
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              password: data.password
            }
            this.api.editUser(this.token, data.id, dataToSend).subscribe(data => {
              this.api.getAllUser(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
                
              })
            this.dataSource.sort = this.sort;
            })
          }
      }
  })
  }

  addNewProject(){
    let dialogRef = this.dialog.open(this.addElementDialog);
    this.projectDetails = {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            this.api.addUser(this.token, this.projectDetails).subscribe(data => {
              this.api.getAllUser(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
                
              })
            this.dataSource.sort = this.sort;
            })
          }
      }
  })
  }

  deleteProject(data: any) {
    this.selectedProjectName = data.name
    let dialogRef = this.dialog.open(this.deleteElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
            this.api.deleteUser(this.token, data.id).subscribe( data => {
              this.api.getAllUser(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, 5)[0]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
                
              })
              this.dataSource.sort = this.sort;
            });
        }
      }
  })
  }

  openSelectProject(element: any): void {
    this.api.getProjectForUserById(this.token, element.id).subscribe(data => {
    let selected: any[] = []
    data.map((id: { id: any; }) => selected.push(id.id))

    this.selectedProjects = selected;
    const dialogRef = this.dialog.open(this.selectProjectForStudent, {
      width: '250px',
      data: { projects: this.projects }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          for (var i = 0; i < this.selectedProjects.length; i++) {
          this.api.assignStudentsToProjectByAdmin(this.token, this.selectedProjects[i], element.id).subscribe(data => {
            this.selectedProjects = [];
          });
        }
      }
    }
    });
  });
  }

}
