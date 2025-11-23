import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ 
    CommonModule,
      RouterModule,
      FormsModule,],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  messages: any[] = [];
  newMessage = '';
  clientId!: number;
  employeId!: number;
  emeteur!: 0|1;
  constructor(private chatService: ChatService,private authService : AuthService) {}
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user.role === 'CLIENT') {
      this.clientId = user.id;
      this.employeId = 2;
      this.emeteur = 0;
    } else {
      this.clientId = 5; 
      this.employeId = user.id;
      this.emeteur = 1;
    }

    //this.getAllMessages();
  }
 /* getAllMessages() {
  this.chatService.getAll().subscribe(
    (data: Chat[]) => {
      this.messages = data;
      console.log(this.messages);
    },
    (error) => {
      console.error('Erreur lors de la récupération des messages', error);
    }
  );
}
  /*sendMessage() {
  const contenu = this.newMessage?.trim();
  if (!contenu) return;

  const nouveauMessage: Chat = {
    client_id: this.clientId,
    employe_id: this.employeId,
    message: contenu,
    est_lu: false,
    emeteur: this.emeteur
  };
  console.log(nouveauMessage);

  this.chatService.sendMessage(
    nouveauMessage).subscribe({
    next: (msg: Chat) => {
      this.messages.push(msg);   
      this.newMessage = '';      
    },
    error: (err) => {
      console.error('Erreur lors de l’envoi du message :', err);
    }
  });
}*/
}
