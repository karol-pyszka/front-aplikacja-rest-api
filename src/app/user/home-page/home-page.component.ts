import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/_api/api.service';
import { Projekt } from 'src/app/_models/project';
import { formatDate, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

registerLocaleData(localePl);


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
  token: string = ''
  userRole = ''
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'endTo', 'showTask','edit', 'upload', 'download'];

  ELEMENT_DATA: Projekt[] = []

  constructor(public dialog: MatDialog, private router: Router, private api: ApiService, private cookieService: CookieService, 
    private http: HttpClient, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.token = this.cookieService.get('userToken');
    if(this.cookieService.check("userToken")){
      let jwtData = this.cookieService.get("userToken").split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      this.userRole = decodedJwtData.role
      if(this.userRole == 'ADMIN'){
        this.displayedColumns = ['name', 'description', 'createdAt', 'endTo', 'showTask','edit', 'delete', 'upload', 'download'];
      }
    }
    this.api.getProjects(this.token).subscribe(data => {
      this.ELEMENT_DATA = data
      console.log(this.ELEMENT_DATA)
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

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selectedProjectName = ''
  projectDetails!:Projekt;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // normal should pass uid if is
  showTask(element: any) {
    //console.log(element)
    //this.router.navigate(["tasks"], { state: { data: 'nazwa' } });
    this.router.navigate(['tasks', {data: element.name, id:element.id}]);
  }

  editProject(data: any) {
    this.projectDetails = data

    console.log(data)
    let dialogRef = this.dialog.open(this.editElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            let proj: Projekt = {
              name: this.projectDetails.name,
              description: this.projectDetails.description,
              dateTimeCreated: data.dateTimeCreated,
              dateTimeHandOver: formatDate(this.projectDetails.dateTimeHandOver!, 'yyyy-MM-dd HH:mm:ss.SSS', 'pl')
            }
            console.log(proj)
            console.log(data.id)
            this.api.editProject(data.id, proj,this.token).subscribe(data =>{
              this.api.getProjects(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
              })
            })
            
      }
  }})
  }

  addNewProject(){
    let dialogRef = this.dialog.open(this.addElementDialog);
    this.projectDetails = {
      name: '',
      description: '',
      dateTimeCreated:'',
      dateTimeHandOver: ''
    }
    const dataCzasUtworzenia: Date = new Date();
    const formattedDataCzasUtworzenia: string = formatDate(dataCzasUtworzenia, 'yyyy-MM-dd HH:mm:ss.SSS', 'pl');
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
          if (result === true) {
            let proj: Projekt = {
              name: this.projectDetails.name,
              description: this.projectDetails.description,
              dateTimeCreated: formattedDataCzasUtworzenia,
              dateTimeHandOver: formatDate(this.projectDetails.dateTimeHandOver!, 'yyyy-MM-dd HH:mm:ss.SSS', 'pl')
            }
            this.api.addProject(proj,this.token).subscribe(data =>{
              this.api.getProjects(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
              })
            })
            
      }
  }})}

  deleteProject(data: any) {
    this.selectedProjectName = data.name
    let dialogRef = this.dialog.open(this.deleteElementDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
            this.api.deleteProject(data.id,this.token).subscribe({
              next: (data) => {
                this.api.getProjects(this.token).subscribe({ next: (data) => {
                  this.ELEMENT_DATA = data
                  this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                  if(this.ELEMENT_DATA == null)
                  {
                    this.length = 0
                  }
                  else{
                    this.length = this.ELEMENT_DATA.length
                  }
                },
                error: (error) => {

                }
                });
              },
              error: (error) => {
              }
            });
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
              this.api.getProjects(this.token).subscribe(data => {
                this.ELEMENT_DATA = data
                this.dataSource = new MatTableDataSource(this.sliceIntoChunks(this.ELEMENT_DATA, this.pageSize)[this.pageIndex]);
                if(this.ELEMENT_DATA == null)
                {
                  this.length = 0
                }
                else{
                  this.length = this.ELEMENT_DATA.length
                }
              })
           // })
            
          }
      }
  })
  }




  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(id: any): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      const headers = new HttpHeaders({Authorization: `Bearer ${this.token}`});
      this.http.post('/api/upload/' + id, formData, { headers }).pipe(
      ).subscribe({
        next: () => {
          this.toastrService.success('File uploaded successfully');
        },
        error: () => {
          this.toastrService.success('Udało się wysłać plik');
        }
      });
    }
  }

  downloadFile(id: any): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    });

    this.http.get('/api/download/' + id, {
      headers,
      responseType: 'blob',
    }).subscribe(
      (response) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        downloadLink.href = url;
        downloadLink.download = 'file.txt';
        downloadLink.click();

        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.toastrService.error("Wystąpił błąd prosze spróbować później")
      }
    );
  }

}
