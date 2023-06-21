import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignStudentsComponent } from './admin/assign-students/assign-students.component';
import { LoginComponent } from './shared/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { HomePageComponent } from './user/home-page/home-page.component';
import { TasksComponent } from './user/tasks/tasks.component';
import { RegisterComponent } from './shared/register/register.component';
import { ChatComponent } from './user/chat/chat.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'tasks', component: TasksComponent},
  { path: 'assign', component: AssignStudentsComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
