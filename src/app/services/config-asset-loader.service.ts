import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';

export interface IEnvironmentConfiguration {
    'baseApi': string;
    'Ocp-Apim-Subscription-Key': string;
    'serviceDisruptionClientSource': string;
    'serviceDisruptionApiVersion': string;
    'locationsApiVersion': string;
    'analyticsURL': string;
    'guestAuthClientId': string;
    'guestAuthClientSecret': string;
    'guestAuthGrantType': string;
    'cartApiVersion': string;
}

export let environmentConfig: IEnvironmentConfiguration = {
    baseApi: null,
    'Ocp-Apim-Subscription-Key': null,
    serviceDisruptionApiVersion: null,
    serviceDisruptionClientSource: null,
    locationsApiVersion: null,
    analyticsURL: null,
    guestAuthClientId: null,
    guestAuthClientSecret: null,
    guestAuthGrantType: null,
    cartApiVersion: null
};

@Injectable({ providedIn: 'root' })
export class ConfigAssetLoaderService {

    private readonly configPath: string = '/assets/config/config.json';
    private configuration$: Promise<IEnvironmentConfiguration>;

    constructor(private _http: HttpClient) { }

    public loadConfigurations(): Promise<IEnvironmentConfiguration> {
        if (!this.configuration$) {
            // Create a headers object that will prevent caching the config file
            const headers = new HttpHeaders({
                'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                Pragma: 'no-cache',
                Expires: '0'
            });

            this.configuration$ = this._http.get<IEnvironmentConfiguration>(this.configPath, { headers })
                .pipe(
                    shareReplay(1),
                    tap((data: IEnvironmentConfiguration) => environmentConfig = data)
                )
                .toPromise();
        }
        return this.configuration$;
    }
}
