import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileShowComponent } from "./profile/profile-show/profile-show.component";
import { ProfileEditComponent} from "./profile/profile-edit/profile-edit.component";
import {PasswordEditComponent} from "./password-edit/password-edit.component";
import {FacebookComponent} from "./facebook/facebook.component";
import { AllAssociationsComponent } from './associations/all-associations/all-associations.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
	
	{ path: 'associations', component: AllAssociationsComponent},

    { path: 'users', component: FacebookComponent },
    { path: 'user/:id', component: ProfileShowComponent },
    { path: 'user/:id/edit', component: ProfileEditComponent },

    { path: 'monprofil/editer/motdepasse', component: PasswordEditComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
