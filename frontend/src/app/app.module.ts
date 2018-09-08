import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPaginationModule} from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AllAssociationsComponent } from './associations/all-associations/all-associations.component';

import { ProfileShowComponent } from './profile/profile-show/profile-show.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';

import { PasswordEditComponent } from './password-edit/password-edit.component';
import { FacebookComponent } from './facebook/facebook.component';
import { PhotoComponent } from './profile/photo/photo.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AssociationHomepageComponent } from './associations/association-homepage/association-homepage.component';
import { AssociationSidebarComponent } from './associations/association-sidebar/association-sidebar.component';
import { AssociationPageComponent } from './associations/association-page/association-page.component';
import { AssociationMembersComponent } from './associations/association-members/association-members.component';
import { AssociationSettingsComponent } from './associations/association-settings/association-settings.component';
import { MarketplaceHomeComponent } from './marketplace/marketplace-home/marketplace-home.component';
import { MarketplaceSidebarComponent } from './marketplace/marketplace-sidebar/marketplace-sidebar.component';
import { MarketplaceBasketComponent } from './marketplace/marketplace-basket/marketplace-basket.component';
import { MarketplaceHistoryComponent } from './marketplace/marketplace-history/marketplace-history.component';
import { PaginationControlsComponent } from './pagination-controls/pagination-controls.component';
import { MarketplaceManagerOrdersComponent } from './marketplace/marketplace-manager-orders/marketplace-manager-orders.component';
import { MarketplaceManagerCatalogComponent } from './marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component';
import { MarketplaceManagerHistoryComponent } from './marketplace/marketplace-manager-history/marketplace-manager-history.component';
import {BaseMarketplaceComponent} from "./marketplace/base-marketplace-component";

// alternatively if you only need to include a subset of languages
var hljs: any;

export function highlightJsFactory() {
  return hljs;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileShowComponent,
    ProfileEditComponent,
    PasswordEditComponent,
    FacebookComponent,
    PhotoComponent,
    AllAssociationsComponent,
    AssociationHomepageComponent,
    AssociationSidebarComponent,
    AssociationPageComponent,
    AssociationMembersComponent,
    AssociationSettingsComponent,
    MarketplaceHomeComponent,
    MarketplaceSidebarComponent,
    MarketplaceBasketComponent,
    MarketplaceHistoryComponent,
    PaginationControlsComponent,
    MarketplaceManagerOrdersComponent,
    MarketplaceManagerCatalogComponent,
    MarketplaceManagerHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
	BsDropdownModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [ApiService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
