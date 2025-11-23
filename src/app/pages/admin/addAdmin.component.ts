import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user';
import { AdminService } from '../../services/admin.service';
import { Admin } from '../../models/admin';

@Component({
  selector: 'app-addAdmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addAdmin.component.html',
  styleUrl: './admin.component.css'
})
export class AddAdminComponent implements OnInit {
  id!: number;
  submitted=false;
  errorMessage: string = '';
  isEditMode = false;
  adminId?: number;

   adminForm: FormGroup=new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
      nomComplet: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
      niveau: new FormControl('', [Validators.required]),
    }
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adminId = +id;
      this.isEditMode = true;
      this.getById(this.adminId);
    }
  }
  constructor(private httpClient : HttpClient,private adminService: AdminService, private userService: UserService, private router : Router, private route : ActivatedRoute){

  }
  get f2(){
    return this.adminForm.controls;
  }
  getById(id: number) {
      this.adminService.getById(id).subscribe(
        (admin: Admin) => {
          
          this.adminForm.patchValue(
            {
          email: admin.user.email,
          nomComplet: admin.user.nomComplet,
          password: '',
          tel: admin.user.tel,
          niveau: admin.niveau,
        }
          );
        },
        (error) => {
          this.errorMessage = 'Impossible de charger ladmin';
          console.error(error);
        }
      );
    }
  

 onSubmit() {
    this.submitted = true;
    if (this.adminForm.valid) {
      const adminData = {
        ...this.adminForm.value,
        role: 'ADMIN' // 📌 Ajout automatique du rôle Admin
      };

      if (this.isEditMode && this.adminId) {
        this.adminService.updateAdmin(this.adminId, adminData).subscribe(
          () => this.router.navigateByUrl('/admin/administrateur'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour'
        );
      } else {
        this.adminService.addAdmin(adminData).subscribe(
          () => this.router.navigateByUrl('/admin/administrateur'),
          (error) => this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout'
        );
      }
    }
  } }
