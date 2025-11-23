import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  admins: Admin[] = [];
    
    isLoading = false;
    errorMessage = '';
  
    constructor(private adminService: AdminService) {}
  
    ngOnInit(): void {
      this.chargerAdmin();
    }
  
    chargerAdmin() {
      this.isLoading = true;
      this.adminService.getAll().subscribe({
        next: (data) => {
          this.admins = data;
          this.isLoading = false;
          console.log(this.admins);
        },
        error: (err) => {
          this.errorMessage = 'Erreur de chargement des admins';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  
  
    supprimerAdmin(id:number) {
      if (confirm('Voulez-vous vraiment supprimer ce admin ?')) {
        this.adminService.deleteAdmin(id).subscribe({
          next: () => {
            this.admins = this.admins.filter(p => p.id !== id);
          },
          error: (err) => {
            console.error('Erreur suppression producteur', err);
          }
        });
      }
    }
}
