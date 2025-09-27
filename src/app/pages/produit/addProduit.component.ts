import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie.service';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/produit';

@Component({
  selector: 'app-addProduit',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './addProduit.component.html',
  styleUrls: ['./produit.component.css']
})
export class AddProduitComponent {
  form: FormGroup;
  categories: Categorie[] = [];
  isEditMode = false;
  produitId: number | null = null;
  isLoading = false;
  isLoadingCategories = true;
  error: string | null = null;

  // Tableau pour gérer les fichiers et leurs aperçus
  selectedImages: { file: File | null; preview: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      prix: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      saison: ['', [Validators.required]],
      poids: ['', [Validators.required]],
      note: ['', [Validators.required]],
      images: this.fb.array([], Validators.required),
      categorie_id: ['', Validators.required]
    });
  }

  // Getter pour FormArray
  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }

  ngOnInit(): void {
    // Vérifier si mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produitId = Number(id);
      this.isEditMode = true;
    }

    // Charger les catégories
    this.loadCategories();

    // Si édition, charger le produit
    if (this.isEditMode && this.produitId) {
      this.loadProduit();
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
        this.isLoadingCategories = false;
        this.error = 'Erreur lors du chargement des catégories.';
        console.error(err);
      }
    });
  }

  loadProduit(): void {
    if (!this.produitId) return;

    this.isLoading = true;
    this.produitService.getById(this.produitId).subscribe({
      next: (produit: Produit) => {
        this.form.patchValue({
          nom: produit.nom,
          description: produit.description,
          prix: produit.prix,
          stock: produit.stock,
          saison: produit.saison,
          poids: produit.poids,
          note: produit.note,
          categorie_id: produit.categorie_id
        });

        // Charger les images existantes
        if (produit.images) {
          produit.images.forEach(url => {
            this.selectedImages.push({ file: null, preview: url });
            this.images.push(this.fb.control(null)); // placeholder pour FormArray
          });
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Erreur lors du chargement du produit.';
        console.error(err);
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImages.push({ file, preview: e.target.result });
        this.images.push(this.fb.control(file));
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.images.removeAt(index);
  }

  onSubmit(): void {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => this.form.get(key)?.markAsTouched());
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formData = new FormData();
    formData.append('nom', this.form.value.nom);
    formData.append('description', this.form.value.description);
    formData.append('prix', this.form.value.prix);
    formData.append('stock', this.form.value.stock);
    formData.append('poids', this.form.value.poids);
    formData.append('saison', this.form.value.saison);
    formData.append('note', this.form.value.note);
    formData.append('categorie_id', this.form.value.categorie_id);

    // Ajouter toutes les images uploadées
    this.selectedImages.forEach(img => {
      if (img.file) {
        formData.append('images[]', img.file);
      }
    });

    let operation$;
    if (this.isEditMode && this.produitId) {
      operation$ = this.produitService.updateProduit(formData, this.produitId);
    } else {
      operation$ = this.produitService.addProduit(formData);
    }

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/produit']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 422) {
          this.error = 'Données invalides. Vérifiez les champs.';
        } else if (err.status === 403) {
          this.error = 'Vous n\'avez pas les permissions pour cette action.';
        } else {
          this.error = 'Erreur lors de la sauvegarde. Veuillez réessayer.';
        }
        console.error(err);
      }
    });
  }

  // Méthodes utilitaires pour template
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${fieldName} est requis.`;
    if (field.errors['minlength']) return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères.`;
    if (field.errors['min']) return `${fieldName} doit être supérieur à ${field.errors['min'].min}.`;
    return '';
  }

  cancel(): void {
    this.router.navigate(['/admin/produit']);
  }
}
