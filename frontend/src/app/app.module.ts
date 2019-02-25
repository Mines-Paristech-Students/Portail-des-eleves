import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "./api.service";
import { CookieService } from "ngx-cookie-service";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AngularMarkdownEditorModule } from "angular-markdown-editor";
import { MarkdownModule, MarkedOptions } from "ngx-markdown";

import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragulaModule } from "ng2-dragula";
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AllAssociationsComponent } from "./associations/all-associations/all-associations.component";

import { ProfileShowComponent } from "./profile/profile-show/profile-show.component";
import { ProfileEditComponent } from "./profile/profile-edit/profile-edit.component";

import { PasswordEditComponent } from "./password-edit/password-edit.component";
import { FacebookComponent } from "./facebook/facebook.component";
import { PhotoComponent } from "./profile/photo/photo.component";
import { AssociationHomepageComponent } from "./associations/association-homepage/association-homepage.component";
import { AssociationSidebarComponent } from "./associations/association-sidebar/association-sidebar.component";
import { AssociationPageComponent } from "./associations/association-page/association-page.component";
import { AssociationMembersComponent } from "./associations/association-members/association-members.component";
import { AssociationSettingsComponent } from "./associations/association-settings/association-settings.component";
import { MarketplaceHomeComponent } from "./marketplace/marketplace-home/marketplace-home.component";
import { MarketplaceSidebarComponent } from "./marketplace/marketplace-sidebar/marketplace-sidebar.component";
import { MarketplaceBasketComponent } from "./marketplace/marketplace-basket/marketplace-basket.component";
import { MarketplaceHistoryComponent } from "./marketplace/marketplace-history/marketplace-history.component";
import { PaginationControlsComponent } from "./pagination-controls/pagination-controls.component";
import { MarketplaceManagerOrdersComponent } from "./marketplace/marketplace-manager-orders/marketplace-manager-orders.component";
import { MarketplaceManagerCatalogComponent } from "./marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component";
import { MarketplaceManagerCounterComponent } from "./marketplace/marketplace-manager-counter/marketplace-manager-counter.component";
import { MarketplaceCounterProductComponent } from './marketplace/marketplace-manager-counter/marketplace-counter-product.component';
import { MarketplaceManagerFundingsComponent } from "./marketplace/marketplace-manager-fundings/marketplace-manager-fundings.component";
import { BsDropdownModule } from "ngx-bootstrap";
import { RequestCacheService } from "./request-cache.service";
import { CachingInterceptor } from "./caching-interceptor";
import { AuthInterceptor } from "./auth-interceptor";
import { WidgetsComponent } from "./widgets/widgets.component";
import { WidgetBirthdaysComponent } from "./widgets/birthdays/birthdays.component";
import { WidgetPollComponent } from "./widgets/poll/poll.component";
import { WidgetChatComponent } from "./widgets/chat/chat.component";
import { ViewForumComponent } from "./forum/view-forum/view-forum.component";
import { ViewThemeComponent } from "./forum/view-theme/view-theme.component";
import { ViewTopicComponent } from "./forum/view-topic/view-topic.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { LibraryCatalogComponent } from "./library/library-catalog/library-catalog.component";
import { LibrarySidebarComponent } from "./library/library-sidebar/library-sidebar.component";
import { LibraryLoansComponent } from "./library/library-loans/library-loans.component";
import { LibraryManagerCatalogComponent } from "./library/library-manager-catalog/library-manager-catalog.component";
import { LibraryManagerLoansComponent } from "./library/library-manager-loans/library-manager-loans.component";

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
    MarketplaceCounterProductComponent,
    MarketplaceManagerFundingsComponent,
    WidgetsComponent,
    WidgetBirthdaysComponent,
    WidgetChatComponent,
    WidgetPollComponent,
    ViewForumComponent,
    ViewThemeComponent,
    ViewTopicComponent,
    TimelineComponent,
    LibraryCatalogComponent,
    LibrarySidebarComponent,
    LibraryLoansComponent,
    LibraryManagerCatalogComponent,
    LibraryManagerLoansComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    AngularMarkdownEditorModule.forRoot({ iconlibrary: "fa" }),
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
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 6
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 500,
          easing: 'ease'
        },
        hide: {
          preset: 'slide',
          speed: 500,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 500,
          easing: 'ease'
        },
        overlap: 250
      }
    }),
    NgxPaginationModule,
    NgbModule,
    DragulaModule.forRoot()
  ],
  providers: [
    ApiService,
    CookieService,
    RequestCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "fr" }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    WidgetBirthdaysComponent,
    WidgetChatComponent,
    WidgetPollComponent
  ]
})
export class AppModule {}
