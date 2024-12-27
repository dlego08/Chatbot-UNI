import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  messages: { sender: string; text: string }[] = []; // Ahora se maneja con sender y text
  userMessage: string = '';
  loading: boolean = false; // Indicador de carga
  responseError: string | null = null; // Error en caso de fallo

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.userMessage }); // Agregar mensaje del usuario
      this.loading = true;

      // Recupera el token almacenado en localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.responseError = 'No estás autenticado. Por favor, inicia sesión.';
        return;
      }

      // Configura los headers, incluyendo el token
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      // Configura el cuerpo de la solicitud con el formato adecuado
      const body = {
        body: JSON.stringify({
          query: this.userMessage,
        }),
      };

      // Realiza la solicitud HTTP POST al endpoint
      this.http
        .post(
          'https://nowmrpmvyj.execute-api.us-east-1.amazonaws.com/dev/bot',
          body,
          { headers }
        )
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            // Procesa la respuesta del bot
            try {
              const parsedResponse = JSON.parse(response?.body);
              this.messages.push({
                sender: 'bot',
                text: parsedResponse.response || 'No se obtuvo una respuesta del bot.',
              });
            } catch (error) {
              this.responseError = 'Error al procesar la respuesta del bot.';
              console.error('Error al procesar la respuesta:', error);
            }
          },
          error: (err) => {
            this.loading = false;
            this.responseError = 'Error al contactar con el bot. Intenta nuevamente.';
            console.error('Error en la solicitud al bot:', err);
          },
        });

      this.userMessage = ''; // Limpiar el campo de entrada
    }
  }
}
