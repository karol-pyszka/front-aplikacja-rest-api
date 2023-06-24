import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Projekt } from '../_models/project';
import { Zadanie } from '../_models/task';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getProjects(tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});

    return this.http.get<any>(environment.api + 'project', { headers })
  }

  deleteProject(id: any, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.delete<any>(environment.api + 'project/' + id, { headers })
  }

  addProject(project: Projekt, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.post<Projekt>(environment.api + 'project/admin', project, { headers })
  }

  editProject(projektId: any, project: Projekt, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.put(environment.api + 'project/' + projektId, project, { headers })
  }

  getTaskForProjects(projectId: any, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.get<any>(environment.api + 'project/' + projectId + '/task', { headers })
  }

  addTaskForProjects(projectId: any, zadanie: Zadanie, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.post<Zadanie>(environment.api + 'project/' + projectId + '/task', zadanie, { headers })
  }

  deleteTask(projectId: any, taskId: any, tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    return this.http.delete<any>(environment.api + 'project/' + projectId + '/task/' + taskId, { headers })
  }

  registerUser(user: User){
    return this.http.post<any>(environment.api + 'auth/register', user)
  }

  loginUser(email: any, password: any){
    var user = {
      email: email,
      password: password
    }
    return this.http.post<any>(environment.api + 'auth/authenticate', user)
  }

  getAllUser(tokenU: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});

    return this.http.get<any>(environment.api + 'project/appusers', { headers })
  }

  assignStudentsToProjectByAdmin(tokenU: any, projectId: any, userId: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    var content = "po co ja istnieje powiedz mi byczq"
    return this.http.post<any>(environment.api + 'project/admin/'+ projectId + '/user/' + userId, content, { headers })
  }

  getProjectForUserById(tokenU: any, userId: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.get<any>(environment.api + 'project/admin/user/'+ userId, { headers })
  }

  addUser(tokenU: any, data: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post<any>(environment.api + 'project/admin/user', data, { headers })
  }
  
  editUser(tokenU: any, userId: any, data: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.put<any>(environment.api + 'project/admin/user/edit/' + userId, data, { headers })
  }

  deleteUser(tokenU: any, userId: any){
    const token = tokenU;
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.delete<any>(environment.api + 'project/admin/user/delete/' + userId, { headers })
  }
}
