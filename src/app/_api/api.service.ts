import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Projekt } from '../_models/project';
import { Zadanie } from '../_models/task';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  loginUser(login: string, password: string){
    var user = {
      login: login,
      password: password
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'});
  let options = { headers: headers };
    this.http.post<any>(environment.api + 'login/', user, options).subscribe({
      next: data => {
          console.log(data)
          return data
      },
      error: error => {
          console.error('There was an error!', error);
      }
  })
  }

  getProjects(){
    return this.http.get<any>(environment.api + 'projekt')
  }

  deleteProject(id: any){
    return this.http.delete<any>(environment.api + 'projekt/' + id)
  }

  addProject(project: Projekt){
    return this.http.post<Projekt>(environment.api + 'projekt', project)
  }

  editProject(projektId: any, project: Projekt){
    return this.http.put(environment.api + 'projekt/' + projektId, project)
  }

  getTaskForProjects(projectId: any){
    return this.http.get<any>(environment.api + 'projekt/' + projectId + '/zadanie')
  }

  addTaskForProjects(projectId: any, zadanie: Zadanie){
    return this.http.post<Zadanie>(environment.api + 'projekt/' + projectId + '/zadanie', zadanie)
  }

  deleteTask(taskId: any){
    return this.http.delete<any>(environment.api + 'zadanie/' + taskId)
  }
  
}
