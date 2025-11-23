import { Component } from '@angular/core';
import { TokenResponse } from '../../models/token-response';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ProducteurService } from '../../services/producteur.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
   
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;
  submitted = false;
  isSignUpMode = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private producteurService: ProducteurService, private auth: AuthService, private router: Router) {
  }
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),

  })
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }
  loginData = { email: '', password: '' };
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
  
get f() {
    return this.proForm.controls;
  }
  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      console.log('connexion valide');
      
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: TokenResponse) => {
          console.log('Token reçu:', res.access_token);
          
          // méthode pour attendre l'utilisateur
          this.auth.waitForUserLoaded().subscribe({
            next: (user) => {
              this.isLoading = false;
              console.log('Utilisateur final:', user);
              console.log('Rôle de l\'utilisateur:', user?.role);
              
              if (user?.role === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else if (user?.role === 'PRO') {
                console.log("sallut");
                this.router.navigate(['/producteur']);
              } else if (user?.role === 'CLIENT') {
                this.router.navigate(['/client']);
              } else {
                // Par défaut, rediriger vers login si pas de rôle spécifique
                this.router.navigate(['/login']);
              }
            },
            error: (err) => {
              this.isLoading = false;
              console.error('Erreur chargement utilisateur:', err);
              // En cas d'erreur, rediriger quand même
              this.router.navigate(['/login']);
            }
          });
        },
        error: err => {
          this.isLoading = false;
          console.error('Erreur de connexion:', err);
          alert("Identifiants incorrects");
        }
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.proForm.valid) {
      const producteurData = {
        ...this.proForm.value,
        role: 'PRO' // 📌 Ajout automatique du rôle Producteur
      };

        this.producteurService.addProducteur(producteurData).subscribe(
          () => this.router.navigateByUrl('/admin/producteur'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout'
        );
    }
  }
}