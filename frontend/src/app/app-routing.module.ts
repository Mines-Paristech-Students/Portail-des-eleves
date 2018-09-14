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
import {AssociationSettingsComponent} from "./associations/association-settings/association-settings.component";
import {MarketplaceHomeComponent} from "./marketplace/marketplace-home/marketplace-home.component";
import {MarketplaceBasketComponent} from "./marketplace/marketplace-basket/marketplace-basket.component";
import {MarketplaceHistoryComponent} from "./marketplace/marketplace-history/marketplace-history.component";
import {MarketplaceManagerOrdersComponent} from "./marketplace/marketplace-manager-orders/marketplace-manager-orders.component";
import {MarketplaceManagerHistoryComponent} from "./marketplace/marketplace-manager-history/marketplace-manager-history.component";
import {MarketplaceManagerCatalogComponent} from "./marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
	
	{ path: 'associations', component: AllAssociationsComponent},
	{ path: 'associations/:id', component: AssociationHomepageComponent},
	{ path: 'associations/:id/members', component: AssociationMembersComponent},
	{ path: 'associations/:id/settings', component: AssociationSettingsComponent},
	{ path: 'associations/:association_id/page/:page_id', component: AssociationPageComponent},

    { path: 'marketplace/:id', component: MarketplaceHomeComponent},
    { path: 'marketplace/:id/basket', component: MarketplaceBasketComponent},
    { path: 'marketplace/:id/history', component: MarketplaceHistoryComponent},

    { path: 'marketplace/:id/manager/orders', component: MarketplaceManagerOrdersComponent},
    { path: 'marketplace/:id/manager/catalog', component: MarketplaceManagerCatalogComponent},

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
