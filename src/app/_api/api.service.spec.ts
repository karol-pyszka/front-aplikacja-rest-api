import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';


describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get projects', () => {
    const token = 'your_token';
    const dummyProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];

    service.getProjects(token).subscribe(projects => {
      expect(projects).toEqual(dummyProjects);
    });

    const req = httpMock.expectOne(environment.api + 'project');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProjects);
  });

  it('should delete project', () => {
    const id = 1;
    const token = 'your_token';

    service.deleteProject(id, token).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/' + id);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should add project', () => {
    const token = 'your_token';
    const project = {
      name: 'New Project',
      description: 'Project description',
      dateTimeCreated: '2023-06-25',
      dateTimeHandOver: '2023-07-01'
    };

    service.addProject(project, token).subscribe(response => {
      expect(response).toEqual(project);
    });

    const req = httpMock.expectOne(environment.api + 'project/admin');
    expect(req.request.method).toBe('POST');
    req.flush(project);
  });

  it('should edit project', () => {
    const projectId = 1;
    const token = 'your_token';
    const project = {
      name: 'Updated Project',
      description: 'Updated description',
      dateTimeCreated: '2023-06-25',
      dateTimeHandOver: '2023-07-01'
    };

    service.editProject(projectId, project, token).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/' + projectId);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should get tasks for project', () => {
    const projectId = 1;
    const token = 'your_token';
    const dummyTasks = [{ id: 1, name: 'Task 1' }, { id: 2, name: 'Task 2' }];

    service.getTaskForProjects(projectId, token).subscribe(tasks => {
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(environment.api + 'project/' + projectId + '/task');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should add task for project', () => {
    const projectId = 1;
    const token = 'your_token';
    const task = {
      name: 'New Task',
      description: 'Task description',
      createdDate: '2023-06-25',
      endToDate: '2023-07-01'
    };

    service.addTaskForProjects(projectId, task, token).subscribe(response => {
      expect(response).toEqual(task);
    });

    const req = httpMock.expectOne(environment.api + 'project/' + projectId + '/task');
    expect(req.request.method).toBe('POST');
    req.flush(task);
  });

  it('should delete task', () => {
    const projectId = 1;
    const taskId = 1;
    const token = 'your_token';

    service.deleteTask(projectId, taskId, token).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/' + projectId + '/task/' + taskId);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should register user', () => {
    const user = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password: 'password'
    };

    service.registerUser(user).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should login user', () => {
    const email = 'johndoe@example.com';
    const password = 'password';

    service.loginUser(email, password).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'auth/authenticate');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get all users', () => {
    const token = 'your_token';
    const dummyUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    service.getAllUser(token).subscribe(users => {
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(environment.api + 'project/appusers');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should assign students to project by admin', () => {
    const token = 'your_token';
    const projectId = 1;
    const userId = 1;
    const content = 'po co ja istnieje powiedz mi byczq';

    service.assignStudentsToProjectByAdmin(token, projectId, userId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/admin/' + projectId + '/user/' + userId);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get project for user by ID', () => {
    const token = 'your_token';
    const userId = 1;
    const dummyProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }];

    service.getProjectForUserById(token, userId).subscribe(projects => {
      expect(projects).toEqual(dummyProjects);
    });

    const req = httpMock.expectOne(environment.api + 'project/admin/user/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProjects);
  });

  it('should add user', () => {
    const token = 'your_token';
    const data = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password: 'password'
    };

    service.addUser(token, data).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/admin/user');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should edit user', () => {
    const token = 'your_token';
    const userId = 1;
    const data = {
      firstname: 'Updated John',
      lastname: 'Updated Doe',
      email: 'updatedjohndoe@example.com',
      password: 'updatedpassword'
    };

    service.editUser(token, userId, data).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/admin/user/edit/' + userId);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete user', () => {
    const token = 'your_token';
    const userId = 1;

    service.deleteUser(token, userId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(environment.api + 'project/admin/user/delete/' + userId);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});

