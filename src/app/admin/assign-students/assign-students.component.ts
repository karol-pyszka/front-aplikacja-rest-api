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
import { ProjectElement, PROJECTS_DATA } from 'src/app/user/home-page/home-page.component';

export interface StudentElement {
  position: number;
  name: string;
  surname: string;
  index: string;
}

const ELEMENT_DATA: StudentElement[] = [
  {position: 1, name: 'Jan', surname: 'Niezbędny', index: '1234'},
  {position: 2, name: 'Adam', surname: 'Zbędny', index: '5352'},
  {position: 3, name: 'Krzysiu', surname: 'Andrut', index: '2322'},
  {position: 4, name: 'Lorem', surname: 'xxxx', index: '7454'},
  {position: 5, name: 'ipsum', surname: 'yyyy', index: '4256'},
  {position: 6, name: 'set', surname: 'xsdf', index: '2355'},
  {position: 7, name: 'dolorem', surname: 'sfsf', index: '9864'},
];

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

  projects: ProjectElement[] = PROJECTS_DATA;

  selectedProjects: number[] = [];

  constructor(public dialog: MatDialog, private router: Router) {}

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
  
  displayedColumns: string[] = ['position', 'name', 'surname', 'index', 'showTask','edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedProjectName = ''
  projectDetails!: StudentElement;


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
      surname: '',
      index: '',
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

  openSelectProject(element: any): void {
    const dialogRef = this.dialog.open(this.selectProjectForStudent, {
      width: '250px',
      data: { projects: this.projects }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          console.log(this.selectedProjects)
        }
    }
    });
  }

}
