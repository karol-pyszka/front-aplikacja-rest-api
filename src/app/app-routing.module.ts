import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { HomePageComponent } from './user/home-page/home-page.component';
import { TasksComponent } from './user/tasks/tasks.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'tasks', component: TasksComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
