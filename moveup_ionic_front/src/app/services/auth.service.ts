
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

/** Usuario autenticado expuesto al frontend. */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthUser | null;
}

export interface PasswordResetRequestResponse {
  detail?: string;
  reset_token: string;
}

export interface PasswordResetConfirmResponse {
  detail?: string;
}


/**
 * Servicio de autenticación.
 *
 * Maneja login, registro, recuperación de contraseña y persistencia básica
 * de la sesión del usuario en el navegador.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private storageSvc: StorageService) {}

  /** Verifica si existe un token guardado en localStorage. */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /** Expone el estado de autenticación como observable. */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  /** Devuelve el token actual, si existe. */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Recupera el usuario persistido localmente. */
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  /** Guarda token y datos básicos de sesión. */
  setSession(token: string, user?: AuthUser | null): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.loggedIn$.next(true);
  }

  /** Limpia sesión y caché local usada por la app. */
  async clearSession(): Promise<void> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    await this.storageSvc.clearLocalCache();
    this.loggedIn$.next(false);
  }

  /** Cierra la sesión del usuario. */
  async logout(): Promise<void> {
    await this.clearSession();
  }

  /** Solicita login al backend. */
  login(payload: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login/`, payload).pipe(
      tap((res) => {
        if (res?.token) this.setSession(res.token, res?.user ?? null);
      })
    );
  }

  /** Registra un nuevo usuario. */
  register(payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Observable<unknown> {
    return this.http.post<unknown>(`${environment.apiBaseUrl}/api/auth/register/`, payload);
  }

  /** Consulta el perfil del usuario autenticado. */
  me(): Observable<{ user?: AuthUser }> {
    return this.http.get<{ user?: AuthUser }>(`${environment.apiBaseUrl}/api/auth/me/`).pipe(
      tap((res) => {
        if (res?.user) localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      })
    );
  }

  /** Solicita un token para restablecimiento de contraseña. */
  requestReset(email: string): Observable<PasswordResetRequestResponse> {
    return this.http.post<PasswordResetRequestResponse>(`${environment.apiBaseUrl}/api/auth/password-reset/request/`, { email });
  }

  /** Confirma el cambio de contraseña con token. */
  confirmReset(reset_token: string, new_password: string): Observable<PasswordResetConfirmResponse> {
    return this.http.post<PasswordResetConfirmResponse>(`${environment.apiBaseUrl}/api/auth/password-reset/confirm/`, {
      reset_token,
      new_password,
    });
  }

  // Helpers Promise para facilitar el uso con async/await.
  loginAsync(username: string, password: string): Promise<LoginResponse> {
    return firstValueFrom(this.login({ username, password }));
  }

  registerAsync(payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<unknown> {
    return firstValueFrom(this.register(payload));
  }

  requestResetAsync(email: string): Promise<PasswordResetRequestResponse> {
    return firstValueFrom(this.requestReset(email));
  }

  confirmResetAsync(reset_token: string, new_password: string): Promise<PasswordResetConfirmResponse> {
    return firstValueFrom(this.confirmReset(reset_token, new_password));
  }
}
