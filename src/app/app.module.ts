import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ConfigAssetLoaderService } from './services/config-asset-loader.service';
import { AuthService } from './auth/authservice';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { WINDOW_PROVIDERS } from './services/window.service';
import { HttpManagerService } from './services/http-manager.service';


@Injectable({ providedIn: 'root' })
export class AppInitializeService {
    constructor(private config: ConfigAssetLoaderService, private auth: AuthService) { }

    init(): Promise<any> {
        // Load the config values and then retrieve a guest token
        return this.config.loadConfigurations()
            .then(_ => this.auth.obtainGuestToken());
    }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, SharedModule, AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
  },
  {
      provide: APP_INITIALIZER,
      useFactory: (_appInitialize: AppInitializeService) => () => _appInitialize.init(),
      deps: [AppInitializeService],
      multi: true
  },
  HttpManagerService,
  WINDOW_PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
