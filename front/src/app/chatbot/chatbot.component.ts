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
  messages: { sender: string; text: string }[] = []; // Historial de mensajes
  userMessage: string = ''; // Mensaje actual del usuario
  loading: boolean = false; // Indicador de carga
  responseError: string | null = null; // Mensaje de error

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.userMessage.trim()) {
      // Agregar mensaje del usuario al historial
      this.messages.push({ sender: 'user', text: this.userMessage });
      this.loading = true;

      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.responseError = 'No estás autenticado. Por favor, inicia sesión.';
        return;
      }

      // Configurar los headers de la solicitud
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      // Construir el historial concatenado con un encabezado descriptivo
      const context = this.messages
        .slice(-5) // Limitar a los últimos 5 mensajes
        .map((msg) => `${msg.sender === 'user' ? 'Usuario' : 'Bot'}: ${msg.text}`) // Formatear los mensajes
        .join('\n'); // Unir con saltos de línea

        const fullQuery = `
        Eres un asistente inteligente diseñado para ayudar a responder preguntas de manera precisa y contextual. 
        Tienes memoria de los últimos mensajes de la conversación para brindar respuestas relevantes. 
        Historial de conversación:
        ${context}
        Usuario: ${this.userMessage}
        Bot:`;

      // Cuerpo de la solicitud
      const body = {
        body: JSON.stringify({
          query: fullQuery, // Prompt mejorado
        }),
      };

      // Realizar la solicitud HTTP al backend
      this.http
        .post(
          'https://nowmrpmvyj.execute-api.us-east-1.amazonaws.com/dev/bot',
          body,
          { headers }
        )
        .subscribe({
          next: (response: any) => {
            this.loading = false;
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

      // Limpiar el campo de entrada del usuario
      this.userMessage = '';
    }
  }
}
