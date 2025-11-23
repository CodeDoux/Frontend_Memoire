import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule, NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie.service';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produit';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-produit',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './addProduit.component.html',
  styleUrls: ['./produit.component.css']
})
export class AddProduitComponent implements OnInit {
  @ViewChild('productForm') form!: NgForm;

  productData = {
    name: '',
    category: '',
    description: '',
    price: 0,
    promoPrice: 0,
    unit: '',
    note: 0,
    weight: '',
    stock: 0,
    stockAlert: 5,
    origin: '',
    season: '',
    isBio: false,
    isLocal: false,
    isSeasonal: false,
    mainImage: '',
    additionalImages: [] as File[]
  };
  categories: Categorie[] = [];
  isEditMode = false;
  produitId: number | null = null;
  isLoading = false;
  isLoadingCategories = true;
  error: string | null = null;
mainImageFile: File | null = null;
  additionalImageFiles: File[] = [];
  selectedImages: { file: File | null; preview: string }[] = [];
  

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produitId = Number(id);
      this.isEditMode = true;
      this.loadProduit();
    }

    this.loadCategories();
  }
  onAdditionalImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file && this.productData.additionalImages.length < 4) {
      this.additionalImageFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productData.additionalImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  removeAdditionalImage(index: number): void {
    this.productData.additionalImages.splice(index, 1);
    this.additionalImageFiles.splice(index, 1);
  }
  removeMainImage(): void {
    this.productData.mainImage = '';
    this.mainImageFile = null;
  }
  onMainImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mainImageFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productData.mainImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories.';
        this.isLoadingCategories = false;
        console.error(err);
      }
    });
  }

  loadProduit(): void {
    if (!this.produitId) return;
    this.isLoading = true;

    this.produitService.getById(this.produitId).subscribe({
      next: (produit: Produit) => {
         this.productData.name = produit.nom;
this.productData.description = produit.description;
this.productData.price = produit.prix;
//this.productData.weight = produit.poids;
this.productData.stock = produit.stock;
//this.productData.category = this.categorieService.getById(produit.categorie_id);
this.productData.isSeasonal = produit.saison === 'SEASON';

       /* if (produit.images) {
          produit.images.forEach((url) => {
            this.selectedImages.push({ file: null, preview: url });
            this.images.push(this.fb.control(null));
          });
        }*/
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du produit.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /*onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push({ file, preview: e.target.result });
        this.images.push(this.fb.control(file));
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.images.removeAt(index);
  }*/

  onSubmit(): void {
  if (this.form.invalid) {
    this.form.control.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.error = null;

  // -------------------------------------------
  // 1️⃣ Vérifier l'ID du producteur connecté
  // -------------------------------------------
  const currentUser = this.authService.getCurrentUser();

  if (!currentUser?.producteur?.id) {
    this.error = 'Impossible de déterminer votre ID producteur.';
    this.isLoading = false;
    return;
  }

  const producteurId = currentUser.producteur.id;


  // -------------------------------------------
  // 2️⃣ Préparer FormData pour Laravel
  // -------------------------------------------
  const formData: FormData = new FormData();
  const note=2;

  formData.append('nom', this.productData.name);
  formData.append('description', this.productData.description);
  formData.append('prix', String(Math.floor(this.productData.price)));
  formData.append('stock', String(Math.floor(this.productData.stock)));
  formData.append('poids', this.productData.weight);
  formData.append('seuilAlerteStock', String(Math.floor(this.productData.stockAlert)));
  formData.append('categorie_id', this.productData.category);
  formData.append('producteur_id', producteurId.toString());
  formData.append('note',String(Math.floor(this.productData.note)));
  formData.append('statut', 'DISPONIBLE');
  formData.append('validationAdmin', 'EN_ATTENTE');

  // saison optionnelle
  formData.append('saison', this.productData.isSeasonal ? 'SEASON' : '');

  // Images
this.additionalImageFiles.forEach(file => {
  formData.append('images[]', file);
});   


  // -------------------------------------------
  // 3️⃣ Requête API : add ou update
  // -------------------------------------------
  let request$: Observable<any>;

  if (this.isEditMode && this.produitId) {
    request$ = this.produitService.updateProduit(this.produitId, formData);
  } else {
   formData.forEach((value, key) => {
  if (value instanceof File) {
    console.log(`${key}: ${value.name} (${value.size} bytes)`);
  } else {
    console.log(`${key}: ${value}`);
  }
});
    request$ = this.produitService.addProduit(formData);
  }

  request$.subscribe({
    next: () => {
      this.isLoading = false;
      this.router.navigate(['/producteur/produit']);
    },
    error: (err) => {
      this.isLoading = false;

      if (err.status === 422) {
        this.error = 'Données invalides. Vérifiez les champs.';
      } else {
        this.error = 'Erreur lors de la sauvegarde.';
      }

      console.error(err);
    }
  });
}


  /*hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }*/

  /*getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${fieldName} est requis.`;
    if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères.`;
    if (field.errors['min']) return `${fieldName} doit être supérieur à ${field.errors['min'].min}.`;
    return '';
  }*/

  cancel(): void {
    if (this.authService.hasRole('ADMIN')) {
      this.router.navigate(['/admin/produit']);
    } else {
      this.router.navigate(['/producteur/produit']);
    }
  }
}
