import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlobComponent } from './azureblob/blob/blob.component';
import { ContactComponent } from './home/contact/contact.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProjectmanagementComponent } from './home/projectmanagement/projectmanagement.component';
import { TaskmanagementComponent } from './home/taskmanagement/taskmanagement.component';
import { TasksComponent } from './home/tasks/tasks.component';
import { UserManagementComponent } from './home/user-management/user-management.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuard } from './shared/auth.guard';
import { TableComponent } from './table/table.component';


const routes: Routes = [
  {path:'', component:LoginComponent},

  {path:'dashboard',component:HomeComponent,canActivate:[AuthGuard],
children : [{ path : '' , component :DashboardComponent},
]
},
  {path:'contact',component:HomeComponent,canActivate:[AuthGuard],
children:[{path:'',component:ContactComponent}]},

{path:'usermanagement',component:HomeComponent,canActivate:[AuthGuard],
children:[{path:'',component: UserManagementComponent}]},

{path:'projectmanagement',component:HomeComponent,canActivate:[AuthGuard],
children:[{path:'',component:ProjectmanagementComponent}]},

{path:'taskmanagement',component:HomeComponent,canActivate:[AuthGuard],
children:[{path:'',component:TaskmanagementComponent}]},

{path:'tasks',component:HomeComponent,canActivate:[AuthGuard],
children:[{path:'',component:TasksComponent}]},


  {path:'upload', component:BlobComponent},
  {path:'table', component:TableComponent},
  {path:'verify', component:LoadingComponent},
  {path:'logout', component:LogoutComponent},
  {path:'project',component:ProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
