import { Component } from '@angular/core';
import { Codelist } from '../../models/codelist';
import { CodelistService } from '../../services/codelist.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-list',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './code-list.component.html',
  styleUrl: './code-list.component.css'
})
export class CodeListComponent {
  codelists : Codelist[] =[];
    
    constructor(private codelistService : CodelistService,
      private route : Router
    ){
  
    }
  
    ngOnInit():void {
      this.getAll();
    }
  
  
    getAll(){
      this.codelistService.getAll().subscribe(
        (data : Codelist[])=>{
          this.codelists = data;
          console.log(data);
        },
        (error)=>{
          console.log(error);
        }
      )
    }
  
    deleteCodelist(id: number){
      this.codelistService.deleteCodeList(id).subscribe(
        ()=>{
          this.getAll();
        },
        (error)=>{
          console.log(error);
        }
      )
    }
  

}
