import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {ProfileShowComponent} from "./profile/profile-show/profile-show.component";
import {ProfileEditComponent} from "./profile/profile-edit/profile-edit.component";
import {PasswordEditComponent} from "./password-edit/password-edit.component";
import {FacebookComponent} from "./facebook/facebook.component";
import {AllAssociationsComponent} from './associations/all-associations/all-associations.component';
import {AssociationHomepageComponent} from "./associations/association-homepage/association-homepage.component";
import {AssociationMembersComponent} from "./associations/association-members/association-members.component";
import {AssociationPageComponent} from "./associations/association-page/association-page.component";
import {AssociationFilesystemBrowserComponent} from "./associations/association-filesystem/association-filesystem-browser/association-filesystem-browser.component";
import {AssociationSettingsComponent} from "./associations/association-settings/association-settings.component";
import {MarketplaceHomeComponent} from "./marketplace/marketplace-home/marketplace-home.component";
import {MarketplaceBasketComponent} from "./marketplace/marketplace-basket/marketplace-basket.component";
import {MarketplaceHistoryComponent} from "./marketplace/marketplace-history/marketplace-history.component";
import {MarketplaceManagerOrdersComponent} from "./marketplace/marketplace-manager-orders/marketplace-manager-orders.component";
import {MarketplaceManagerCatalogComponent} from "./marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component";
import {MarketplaceManagerCounterComponent} from "./marketplace/marketplace-manager-counter/marketplace-manager-counter.component";
import {MarketplaceManagerFundingsComponent} from "./marketplace/marketplace-manager-fundings/marketplace-manager-fundings.component";
import {ViewForumComponent} from "./forum/view-forum/view-forum.component"
import {ViewThemeComponent} from "./forum/view-theme/view-theme.component"
import {ViewTopicComponent} from "./forum/view-topic/view-topic.component"
import { AssociationFilesystemAddfileComponent } from "./associations/association-filesystem/association-filesystem-addfile/association-filesystem-addfile.component";
import { AssociationFilesystemFileComponent } from "./associations/association-filesystem/association-filesystem-file/association-filesystem-file.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},

    {path: 'associations', component: AllAssociationsComponent},
    {path: 'associations/:id', component: AssociationHomepageComponent},
    {path: 'associations/:id/members', component: AssociationMembersComponent},
    {path: 'associations/:id/settings', component: AssociationSettingsComponent},
    {path: 'associations/:association_id/page/:page_id', component: AssociationPageComponent},

    {path: 'associations/:id/files', component: AssociationFilesystemBrowserComponent},
    {path: 'associations/:id/files/:folder_id', component: AssociationFilesystemBrowserComponent},
    {path: 'associations/:id/files/:folder_id/add', component: AssociationFilesystemAddfileComponent},
    {path: 'associations/:id/files/add/root', component: AssociationFilesystemAddfileComponent},
    {path: 'associations/:id/file/:file_id', component: AssociationFilesystemFileComponent},

    {path: 'marketplace/:id', component: MarketplaceHomeComponent},
    {path: 'marketplace/:id/basket', component: MarketplaceBasketComponent},
    {path: 'marketplace/:id/history', component: MarketplaceHistoryComponent},

    {path: 'marketplace/:id/manager/orders', component: MarketplaceManagerOrdersComponent},
    {path: 'marketplace/:id/manager/catalog', component: MarketplaceManagerCatalogComponent},
    {path: 'marketplace/:id/manager/counter', component: MarketplaceManagerCounterComponent},
    {path: 'marketplace/:id/manager/fundings', component: MarketplaceManagerFundingsComponent},

    {path: 'users', component: FacebookComponent},
    {path: 'user/:id', component: ProfileShowComponent},
    {path: 'user/:id/edit', component: ProfileEditComponent},

    {path: 'monprofil/editer/motdepasse', component: PasswordEditComponent},

    {path: 'forum', component: ViewForumComponent},
    {path: 'forum/theme/:theme', component: ViewThemeComponent},
    {path: 'forum/topic/:topic', component: ViewTopicComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
