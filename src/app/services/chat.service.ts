import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private URL = 'http://127.0.0.1:8000/api/chats';

  constructor(private httpClient: HttpClient) {}
  sendMessage(chat: Chat): Observable<Chat> {
  return this.httpClient.post<Chat>(this.URL,chat);
}
  getAll():Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(this.URL);
  }

}
