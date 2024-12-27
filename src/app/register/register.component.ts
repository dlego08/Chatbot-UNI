import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Estilos personalizados
})
export class RegisterComponent {
  // Variables para el formulario de registro
  username: string = '';
  email: string = '';
  password: string = '';

  // Variables para la verificación
  verificationCode: string = '';
  verificationStep: boolean = false; // Indica si estamos en la verificación

  // Estado de la respuesta del servidor
  serverMessage: string | null = null; // Mensaje para mostrar al usuario
  loading: boolean = false; // Indicador de carga

  constructor(private http: HttpClient, private router: Router) {}

  // Método para enviar el registro temporal
  register() {
    if (!this.username || !this.email || !this.password) {
      this.serverMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.loading = true;
    this.serverMessage = null;

    const body = {
      action: 'register_temp',
      username: this.username,
      email: this.email,
      password: this.password,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://7n5wj9njbg.execute-api.us-east-1.amazonaws.com/dev/register', body, {
        headers,
        responseType: 'text', // Aseguramos que la respuesta sea texto
      })
      .subscribe({
        next: (response: string) => {
          this.loading = false;
          this.serverMessage = response; // Mostrar el mensaje del servidor
          this.verificationStep = true; // Pasar al paso de verificación
        },
        error: (err) => {
          this.loading = false;
          this.serverMessage = err.error || 'Ocurrió un error. Intenta nuevamente.';
          console.error('Error en el registro:', err);
        },
      });
  }

  // Método para verificar el código
  verifyCode() {
    if (!this.verificationCode) {
      this.serverMessage = 'Por favor, ingresa el código de verificación.';
      return;
    }

    this.loading = true;
    this.serverMessage = null;

    const body = {
      action: 'verify',
      email: this.email,
      code: this.verificationCode,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://7n5wj9njbg.execute-api.us-east-1.amazonaws.com/dev/register', body, {
        headers,
        responseType: 'text', // Aseguramos que la respuesta sea texto
      })
      .subscribe({
        next: (response: string) => {
          this.loading = false;
          this.serverMessage = response; // Mostrar el mensaje del servidor

          // Redirigir al login si la verificación fue exitosa
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.serverMessage = err.error || 'Ocurrió un error. Intenta nuevamente.';
          console.error('Error en la verificación:', err);
        },
      });
  }
}
