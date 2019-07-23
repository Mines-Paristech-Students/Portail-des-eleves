import {Injectable} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, zip} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class GetRoleService {

    /**
     * In order to work, this service must be listed as provider for the component linked to the view that
     * will use it.
     */

    permissions: any;

    constructor(private api: ApiService, private route: ActivatedRoute) {
    }

    hasPermission(permissionType: string) {

        return new Observable(observer => {

            let checkPermissions = () => {
                for (let p of this.permissions) {
                    if ((p[permissionType] || p.is_admin)&& !p.is_archived) {
                        observer.next(true);
                        return;
                    }
                }

                observer.next(false);
            };

            if (!this.permissions) {

                zip(
                    this.route.params,
                    this.api.getUser()
                )
                    .pipe(map(([params, user]) => ({params, user})),)
                    .subscribe((res: any) => {

                        if ('id' in res.params) {
                            let association_id = res.params['id'];

                            this.api.get(`roles/?association=${association_id}&user=${res.user.id}`).subscribe(
                                permissions => {
                                    this.permissions = permissions;
                                    checkPermissions();
                                },
                                _ => 0
                            );
                        }
                    });
            } else {
                checkPermissions();
            }

        });
    }

}
