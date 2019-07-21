import {BrowserModule} from "@angular/platform-browser";
import {LOCALE_ID, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "./api.service";
import {CookieService} from "ngx-cookie-service";
// alternatively if you only need to include a subset of languages
import {registerLocaleData} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AllAssociationsComponent} from "./associations/all-associations/all-associations.component";
import {AppComponent} from "./app.component";
import {AssociationFilesystemAddfileComponent} from "./associations/association-filesystem/association-filesystem-addfile/association-filesystem-addfile.component";
import {AssociationFilesystemBreadcrumbComponent} from "./associations/association-filesystem/association-filesystem-breadcrumb/association-filesystem-breadcrumb.component";
import {AssociationFilesystemBrowserComponent} from "./associations/association-filesystem/association-filesystem-browser/association-filesystem-browser.component";
import {AssociationFilesystemFileComponent} from "./associations/association-filesystem/association-filesystem-file/association-filesystem-file.component";
import {AssociationPageComponent} from "./associations/association-page/association-page.component";
import {PhotoComponent} from "./profile/photo/photo.component";
import {NgxPaginationModule} from "ngx-pagination";
import {HomeComponent} from "./home/home.component";
import {AssociationSidebarComponent} from "./associations/association-sidebar/association-sidebar.component";
import {WidgetBirthdaysComponent} from "./widgets/birthdays/birthdays.component";
import {BsDropdownModule} from "ngx-bootstrap";
import {LibraryLoansComponent} from "./library/library-loans/library-loans.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {ViewTopicComponent} from "./forum/view-topic/view-topic.component";
import {WidgetsComponent} from "./widgets/widgets.component";
import {AngularMarkdownEditorModule} from "angular-markdown-editor";
import {PasswordEditComponent} from "./password-edit/password-edit.component";
import {ViewForumComponent} from "./forum/view-forum/view-forum.component";
import {ProfileEditComponent} from "./profile/profile-edit/profile-edit.component";
import {AssociationMembersComponent} from "./associations/association-members/association-members.component";
import {LibraryManagerCatalogComponent} from "./library/library-manager-catalog/library-manager-catalog.component";
import {FacebookComponent} from "./facebook/facebook.component";
import {CachingInterceptor} from "./caching-interceptor";
import {NgSelectModule} from "@ng-select/ng-select";
import {DragulaModule} from "ng2-dragula";
import {NotifierModule} from 'angular-notifier';

import {AppRoutingModule} from "./app-routing.module";
import {WidgetPollComponent} from "./widgets/poll/poll.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AssociationSettingsComponent} from "./associations/association-settings/association-settings.component";
import {MarketplaceManagerCatalogComponent} from "./marketplace/marketplace-manager-catalog/marketplace-manager-catalog.component";
import {MarketplaceBasketComponent} from "./marketplace/marketplace-basket/marketplace-basket.component";
import {MarketplaceManagerFundingsComponent} from "./marketplace/marketplace-manager-fundings/marketplace-manager-fundings.component";
import {LibraryCatalogComponent} from "./library/library-catalog/library-catalog.component";
import {WidgetChatComponent} from "./widgets/chat/chat.component";
import {LibrarySidebarComponent} from "./library/library-sidebar/library-sidebar.component";
import {AuthInterceptor} from "./auth-interceptor";
import {LoginComponent} from "./login/login.component";
import {ProfileShowComponent} from "./profile/profile-show/profile-show.component";
import {MarketplaceHistoryComponent} from "./marketplace/marketplace-history/marketplace-history.component";
import {AssociationHomepageComponent} from "./associations/association-homepage/association-homepage.component";
import {MarketplaceManagerOrdersComponent} from "./marketplace/marketplace-manager-orders/marketplace-manager-orders.component";
import {MarketplaceProductComponent} from "./marketplace/marketplace-product.component";
import {MarketplaceHomeComponent} from "./marketplace/marketplace-home/marketplace-home.component";
import {LibraryManagerLoansComponent} from "./library/library-manager-loans/library-manager-loans.component";
import {RequestCacheService} from "./request-cache.service";
import {MarkdownModule, MarkedOptions} from "ngx-markdown";
import {ViewThemeComponent} from "./forum/view-theme/view-theme.component";
import {AssociationFilesystemMoveComponent} from "./associations/association-filesystem/association-filesystem-move/association-filesystem-move.component";
import {MarketplaceSidebarComponent} from "./marketplace/marketplace-sidebar/marketplace-sidebar.component";
import {TimelineComponent} from "./timeline/timeline.component";
import {MarketplaceManagerCounterComponent} from "./marketplace/marketplace-manager-counter/marketplace-manager-counter.component";

import localeFr from "@angular/common/locales/fr";
import {PaginationControlsComponent} from "./pagination-controls/pagination-controls.component";
import {DebounceChangeDirective} from "./associations/association-members/debounce-change.directive";
// alternatively if you only need to include a subset of languages

var hljs: any;

export function highlightJsFactory() {
    return hljs;
}

registerLocaleData(localeFr);

@NgModule({
    declarations: [
        AllAssociationsComponent,
        AppComponent,
        AssociationFilesystemAddfileComponent,
        AssociationFilesystemBreadcrumbComponent,
        AssociationFilesystemBrowserComponent,
        AssociationFilesystemFileComponent,
        AssociationFilesystemMoveComponent,
        AssociationHomepageComponent,
        AssociationMembersComponent,
        AssociationPageComponent,
        AssociationSettingsComponent,
        AssociationSidebarComponent,
        DebounceChangeDirective,
        FacebookComponent,
        HomeComponent,
        LibraryCatalogComponent,
        LibraryLoansComponent,
        LibraryManagerCatalogComponent,
        LibraryManagerLoansComponent,
        LibrarySidebarComponent,
        LoginComponent,
        MarketplaceBasketComponent,
        MarketplaceHistoryComponent,
        MarketplaceHomeComponent,
        MarketplaceManagerCatalogComponent,
        MarketplaceManagerCounterComponent,
        MarketplaceManagerFundingsComponent,
        MarketplaceManagerOrdersComponent,
        MarketplaceProductComponent,
        MarketplaceSidebarComponent,
        NavbarComponent,
        PaginationControlsComponent,
        PasswordEditComponent,
        PhotoComponent,
        ProfileEditComponent,
        ProfileShowComponent,
        TimelineComponent,
        ViewForumComponent,
        ViewThemeComponent,
        ViewTopicComponent,
        TimelineComponent,
        DebounceChangeDirective,
        LibraryCatalogComponent,
        LibrarySidebarComponent,
        LibraryLoansComponent,
        LibraryManagerCatalogComponent,
        LibraryManagerLoansComponent,
        DebounceChangeDirective,
        LibraryManagerLoansComponent,
        WidgetBirthdaysComponent,
        WidgetChatComponent,
        WidgetPollComponent,
        WidgetsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        AngularMarkdownEditorModule.forRoot({iconlibrary: "fa"}),
        NgSelectModule,
        HttpClientModule,
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
        DragulaModule.forRoot(),
        NgxPaginationModule
    ],
    providers: [
        ApiService,
        CookieService,
        RequestCacheService,
        {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: "fr"}
    ],
    bootstrap:
        [AppComponent],
    entryComponents:
        [
            WidgetBirthdaysComponent,
            WidgetChatComponent,
            WidgetPollComponent
        ]
})

export class AppModule {
}
