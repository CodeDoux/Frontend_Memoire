import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { Producteur, ProducteurService } from '../../services/producteur.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProducteurService } from '../../services/producteur.service';
import { Producteur } from '../../models/producteur';

@Component({
  selector: 'app-add-producteur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addProducteur.component.html',
  styleUrls: ['./producteur.component.css']
})
export class AddProducteurComponent implements OnInit {
  isEditMode = false;
  producteurId?: number;
  errorMessage: string = '';
  submitted = false;

  proForm: FormGroup = new FormGroup({
    // Infos de connexion (user)
    nomComplet: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    telephone: new FormControl('', [Validators.required, Validators.pattern(/^(77|78|76|70|75|33)[0-9]{7}$/)]),

    // Infos producteur
    entreprise: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    ninea: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    emailPro: new FormControl('', [Validators.required, Validators.email]),
    telPro: new FormControl('', [Validators.required, Validators.pattern(/^(77|78|76|70|75)[0-9]{7}$/)]),
  });

  constructor(
    private producteurService: ProducteurService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.producteurId = +id;
      this.isEditMode = true;
      this.getById(this.producteurId);
    }
  }

  get f() {
    return this.proForm.controls;
  }

  getById(id: number) {
    this.producteurService.getById(id).subscribe(
      (pro: Producteur) => {
        this.proForm.patchValue({
          email: pro.utilisateur.email,
          nomComplet: pro.utilisateur.nomComplet,
          password: '',
          telephone: pro.utilisateur.tel,
          entreprise: pro.entreprise,
          emailPro: pro.emailPro,
          telPro: pro.telPro,
          ninea: pro.ninea,
          description: pro.description

        });
      },
      (error) => {
        this.errorMessage = 'Impossible de charger le producteur';
        console.error(error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.proForm.valid) {
      const producteurData = {
        ...this.proForm.value,
        role: 'PRO' // 📌 Ajout automatique du rôle Producteur
      };

      if (this.isEditMode && this.producteurId) {
        this.producteurService.updateProducteur(this.producteurId, producteurData).subscribe(
          () => this.router.navigateByUrl('/admin/utilisateur'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour'
        );
      } else {
        this.producteurService.addProducteur(producteurData).subscribe(
          () => this.router.navigateByUrl('/admin/producteur'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout'
        );
      }
    }
  }
}
