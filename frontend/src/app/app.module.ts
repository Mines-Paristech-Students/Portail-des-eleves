import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApiService} from './api.service';
import {CookieService} from 'ngx-cookie-service';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AngularMarkdownEditorModule} from 'angular-markdown-editor';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';

import {NgSelectModule} from '@ng-select/ng-select';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NavbarComponent} from './navbar/navbar.component';
import {AllAssociationsComponent} from './associations/all-associations/all-associations.component';

import {ProfileShowComponent} from './profile/profile-show/profile-show.component';
import {ProfileEditComponent} from './profile/profile-edit/profile-edit.component';

import {PasswordEditComponent} from './password-edit/password-edit.component';
import {FacebookComponent} from './facebook/facebook.component';
import {PhotoComponent} from './profile/photo/photo.component';
import {AssociationHomepageComponent} from "./associations/association-homepage/association-homepage.component";
import {AssociationSidebarComponent} from "./associations/association-sidebar/association-sidebar.component";
import {AssociationPageComponent} from "./associations/association-page/association-page.component";
import {AssociationMembersComponent} from "./associations/association-members/association-members.component";
import {AssociationFilesystemBrowserComponent} from "./associations/association-filesystem/association-filesystem-browser/association-filesystem-browser.component";
import {AssociationSettingsComponent} from "./associations/association-settings/association-settings.component";
import {MarketplaceHomeComponent} from "./marketplace/marketplace-home/marketplace-home.component";
import {MarketplaceSidebarComponent} from "./marketplace/marketplace-sidebar/marketplace-sidebar.component";
import {MarketplaceBasketComponent} from "./marketplace/marketplace-basket/marketplace-basket.component";
import {MarketplaceHistoryComponent} from "./marketplace/marketplace-history/marketplace-history.component";
import {PaginationControlsComponent} from "./pagination-controls/pagination-controls.component";
import {MarketplaceManagerOrdersComponent} from "./marketplace/marketplace-manager-orders/marketplace-manager-orders.component";
import {MarketplaceManagerCatalogComponent} from "./marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component";
import {MarketplaceManagerCounterComponent} from "./marketplace/marketplace-manager-counter/marketplace-manager-counter.component";
import {MarketplaceManagerFundingsComponent} from "./marketplace/marketplace-manager-fundings/marketplace-manager-fundings.component";
import {BsDropdownModule} from "ngx-bootstrap";
import {RequestCacheService} from "./request-cache.service";
import {CachingInterceptor} from "./caching-interceptor";
import {AuthInterceptor} from "./auth-interceptor";
import {WidgetsComponent} from './widgets/widgets.component';
import {WidgetBirthdaysComponent} from './widgets/birthdays/birthdays.component';
import {WidgetPollComponent} from './widgets/poll/poll.component';
import {WidgetChatComponent} from './widgets/chat/chat.component';
import {ViewForumComponent} from './forum/view-forum/view-forum.component';
import {ViewThemeComponent} from './forum/view-theme/view-theme.component';
import {ViewTopicComponent} from './forum/view-topic/view-topic.component';
import {TimelineComponent} from './timeline/timeline.component';
import {AssociationFilesystemFileComponent} from './associations/association-filesystem/association-filesystem-file/association-filesystem-file.component';
import {AssociationFilesystemAddfileComponent} from './associations/association-filesystem/association-filesystem-addfile/association-filesystem-addfile.component';
import {AssociationFilesystemBreadcrumbComponent} from './associations/association-filesystem/association-filesystem-breadcrumb/association-filesystem-breadcrumb.component';
import {AssociationFilesystemMoveComponent} from './associations/association-filesystem/association-filesystem-move/association-filesystem-move.component';
// alternatively if you only need to include a subset of languages
var hljs: any;

export function highlightJsFactory() {
    return hljs;
}

registerLocaleData(localeFr);

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
        MarketplaceManagerCounterComponent,
        MarketplaceManagerFundingsComponent,
        WidgetsComponent,
        WidgetBirthdaysComponent,
        WidgetChatComponent,
        WidgetPollComponent,
        ViewForumComponent,
        ViewThemeComponent,
        ViewTopicComponent,
        TimelineComponent,
        AssociationFilesystemBrowserComponent,
        AssociationFilesystemFileComponent,
        AssociationFilesystemAddfileComponent,
        AssociationFilesystemBreadcrumbComponent,
        AssociationFilesystemMoveComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        AngularMarkdownEditorModule.forRoot({iconlibrary: 'fa'}),
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useValue: {
                    breaks: true,
                    gfm: true,
                    // renderer: new Renderer(), Here we can add custom markdown tags
                    sanitize: true
                }
            }
        }),
        NgxPaginationModule,
        NgbModule
    ],
    providers: [
        ApiService,
        CookieService,
        RequestCacheService,
        {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: "fr"}
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        WidgetBirthdaysComponent,
        WidgetChatComponent,
        WidgetPollComponent
    ]
})
export class AppModule {
}
