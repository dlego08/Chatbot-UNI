import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private emailKey = 'auth_email';

  // Guardar el token y el correo en localStorage
  login(token: string, email: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.emailKey, email);
  }

  // Eliminar la sesión
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Obtener el email del usuario autenticado
  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }
}
