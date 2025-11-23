import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodelistService } from '../../services/codelist.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Codelist } from '../../models/codelist';

@Component({
  selector: 'app-addcode-list',
  standalone: true,
  imports: [
      HttpClientModule,
      CommonModule,
      ReactiveFormsModule,
    ],
  templateUrl: './addcode-list.component.html',
  styleUrl: './code-list.component.css'
})
export class AddCodeListComponent {
  id!: number;
    submetted = false;
    codelists: Codelist[] = [];
    error: string | null = null;
    codelistForm: FormGroup = new FormGroup({
      type: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    constructor(
        private codelistService: CodelistService, 
        private router: Router,
        private route: ActivatedRoute
      ) {}
      
      ngOnInit(): void {
        if (this.route.snapshot.paramMap.get('id')) {
          this.id = this.route.snapshot.params['id'];
          this.getById(this.id);
        }
      }
      getById(id: number) {
    console.log('🔍 Récupération codelist ID:', id);
    this.codelistService.getById(this.id).subscribe(
      (data) => {
        console.log('✅ codelist récupérée:', data);
        this.codelistForm.patchValue(data);
      },
      (error) => {
        console.error('❌ Erreur récupération codelist:', error);
      }
    )
  }

  get f2() {
    return this.codelistForm.controls;
  }

  onSubmit() {
    this.submetted = true;
    console.log('=== DÉBUT SOUMISSION ===');
    console.log('Formulaire valide:', this.codelistForm.valid);
    console.log('ID présent:', this.id);
    console.log('Valeurs du formulaire:', this.codelistForm.value);
    
    if (this.codelistForm.valid) {
      if (this.id) {
        console.log('🔄 Tentative de modification...');
        this.codelistService.updateCodeList(this.codelistForm.value, this.id).subscribe(
          (response) => {
            console.log('✅ Modification réussie:', response);
            // ✅ CORRECTION: Navigation vers la route admin
            this.router.navigate(['/admin/codelist']);
          },
          (error) => {
            console.error('❌ Erreur modification:', error);
          }
        )
      } else {
        console.log('🔄 Tentative d\'ajout...');
        console.log(this.codelistForm.value);
        this.codelistService.addCodeList(this.codelistForm.value).subscribe(
          (response) => {
            console.log('✅ Ajout réussi:', response);
            // ✅ CORRECTION: Navigation vers la route admin
            this.router.navigate(['/admin/codelist']);
          },
          (error) => {
            console.error('❌ Erreur ajout:', error);
          }
        )
      }
    } else {
      console.log('❌ Formulaire invalide:', this.codelistForm.errors);
      // ✅ AJOUT: Afficher les erreurs de chaque champ
      Object.keys(this.codelistForm.controls).forEach(key => {
        const control = this.codelistForm.get(key);
        if (control && control.invalid) {
          console.log(`❌ Champ ${key} invalide:`, control.errors);
        }
      });
    }
  }
    
  

}
