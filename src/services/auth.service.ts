import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { StorageService } from "./storage.service";
import { LocalUser } from "../models/local_user";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService {

    jwtHelperService : JwtHelperService = new JwtHelperService();

    constructor(
        public http : HttpClient,
        public storage : StorageService,
        public cartService : CartService
    ) {
    }

    authenticate(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue : string) {
        let vToken = authorizationValue.substring(7);
        let user : LocalUser = {
            token : vToken,
            email : this.jwtHelperService.decodeToken(vToken).sub
        };
        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout() {
        this.storage.setLocalUser(null);
    }

}