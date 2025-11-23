import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addclient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addClient.component.html',
  styleUrl: './client.component.css'
})
export class AddClientComponent {
isEditMode = false;
  clientId?: number;
  errorMessage: string = '';
  submitted = false;
  clientForm: FormGroup = new FormGroup({
      // Infos de connexion (user)
      nomComplet: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      telephone: new FormControl('', [Validators.required, Validators.pattern(/^(77|78|76|70|75|33)[0-9]{7}$/)]),
  
      // Infos client
       });
  
    constructor(private clientService: ClientService,private router: Router,
        private route: ActivatedRoute) {}
  
    ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = +id;
      this.isEditMode = true;
      this.getById(this.clientId);
    }
  }
  get f() {
      return this.clientForm.controls;
    }
  
    getById(id: number) {
      this.clientService.getById(id).subscribe(
        (client: Client) => {
          this.clientForm.patchValue({
            email: client.user.email,
            nomComplet: client.user.nomComplet,
            password: '',
            telephone: client.user.tel,
          });
        },
        (error) => {
          this.errorMessage = 'Impossible de charger le client';
          console.error(error);
        }
      );
    }
  
  onSubmit() {
    this.submitted = true;
    if (this.clientForm.valid) {
      const clientData = {
        ...this.clientForm.value,
        role: 'CLIENT' // 📌 Ajout automatique du rôle Client
      };

      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe(
          () => this.router.navigateByUrl('/admin/client'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour'
        );
      } else {
        console.log(clientData);
        this.clientService.addClient(clientData).subscribe(
          () => this.router.navigateByUrl('/admin/client'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout'
        );
      }
    }
  }
}
