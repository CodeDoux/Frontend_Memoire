import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule, FormsModule,RouterModule
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  clients: Client[] = [];
    
    isLoading = false;
    errorMessage = '';
  
    constructor(private clientService: ClientService) {}
  
    ngOnInit(): void {
      this.chargerClients();
    }
  
    chargerClients() {
      this.isLoading = true;
      this.clientService.getAll().subscribe({
        next: (data) => {
          this.clients = data;
          this.isLoading = false;
          console.log(this.clients);
        },
        error: (err) => {
          this.errorMessage = 'Erreur de chargement des producteurs';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  
  
    deleteclient(id:number) {
      if (confirm('Voulez-vous vraiment supprimer ce producteur ?')) {
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            this.clients = this.clients.filter(p => p.id !== id);
          },
          error: (err) => {
            console.error('Erreur suppression producteur', err);
          }
        });
      }
    }

}
