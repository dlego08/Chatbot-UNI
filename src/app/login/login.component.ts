import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Servicio de autenticación

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Estilos personalizados
})
export class LoginComponent {
  // Variables para el formulario
  email: string = '';
  password: string = '';

  // Estados del componente
  loading: boolean = false; // Indicador de carga
  responseError: string | null = null; // Mensajes de error para el usuario

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Método para iniciar sesión
  login() {
    // Validar campos del formulario
    if (!this.email || !this.password) {
      this.responseError = 'Por favor, completa todos los campos.';
      return;
    }

    // Reiniciar estados previos y activar el indicador de carga
    this.loading = true;
    this.responseError = null;

    // Configurar cuerpo de la solicitud
    const body = {
      email: this.email,
      password: this.password,
    };

    // Configurar encabezados de la solicitud
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Realizar la solicitud HTTP POST
    this.http
      .post(
        'https://7n5wj9njbg.execute-api.us-east-1.amazonaws.com/dev/login',
        body,
        { headers, responseType: 'text' } // Cambiamos el responseType a 'text'
      )
      .subscribe({
        next: (response: string) => {
          this.loading = false;

          try {
            // Convertir la respuesta de texto a JSON
            const parsedResponse = JSON.parse(response);

            if (parsedResponse?.token && parsedResponse?.message) {
              this.authService.login(parsedResponse.token, this.email); // Guardar token y correo
              this.router.navigate(['/chatbot']); // Redirigir al chatbot
            } else {
              this.responseError = 'Respuesta inesperada del servidor.';
            }
          } catch (error) {
            this.responseError = 'Error al procesar la respuesta del servidor.';
            console.error('Error al parsear la respuesta:', error);
          }
        },
        error: (err) => {
          this.loading = false;

          // Manejar diferentes tipos de errores con mensajes descriptivos
          if (err.error?.message) {
            this.responseError = err.error.message;
          } else if (err.status === 0) {
            this.responseError =
              'No se pudo conectar con el servidor. Verifica tu conexión.';
          } else if (err.status === 401) {
            this.responseError = 'Credenciales incorrectas. Intenta nuevamente.';
          } else {
            this.responseError = 'Ocurrió un error inesperado. Intenta más tarde.';
          }

          console.error('Error al iniciar sesión:', err);
        },
      });
  }
}
