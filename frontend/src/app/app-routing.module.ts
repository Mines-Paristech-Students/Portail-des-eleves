import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileShowComponent } from "./profile/profile-show/profile-show.component";
import { ProfileEditComponent } from "./profile/profile-edit/profile-edit.component";
import { PasswordEditComponent } from "./password-edit/password-edit.component";
import { FacebookComponent } from "./facebook/facebook.component";
import { AllAssociationsComponent } from './associations/all-associations/all-associations.component';
import { AssociationHomepageComponent } from "./associations/association-homepage/association-homepage.component";
import { AssociationMembersComponent } from "./associations/association-members/association-members.component";
import {AssociationPageComponent} from "./associations/association-page/association-page.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
	
	{ path: 'associations', component: AllAssociationsComponent},
	{ path: 'association/:id', component: AssociationHomepageComponent},
	{ path: 'association/:id/members', component: AssociationMembersComponent},
	{ path: 'association/:association_id/page/:page_id', component: AssociationPageComponent},

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
