import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Award, AwardService } from '../../../services/award/award.service';
import { AwardModalComponent } from "../award-modal/award-modal.component";
import { ProjectModalComponent } from "../project-modal/project-modal.component";
import { FormsModule } from '@angular/forms';
import { CardService, NumberCard } from '../../../services/card/card.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    AwardModalComponent,
    ProjectModalComponent,
    AwardModalComponent,
    ProjectModalComponent,
    FormsModule
],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit{

  awardToEdit: Award | null = null; 

  @Input() ngClass: string = "";
  
  showModalAward = false;
  showModalProject = false;

  project!: Project;
  projectId!: number; 
  awards: Award[] = [];

  qtdCartelas: number = 0;
  tipoCartela: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private awardService: AwardService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const idString = param.get('id');

      if (idString) {
        this.projectId = +idString;
        this.loadProjectDetails(this.projectId);
      } else {
        console.error("ID do projeto não encontrado na URL.");
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe(projectData => {
      this.project = projectData;

      this.awardService.getAwardsByIdProject(id).subscribe(awardData => {
        this.awards = awardData;

        if (this.awards.length < this.project.amountAwards) {
          this.showModalAward = true; // abre modal automaticamente
        }
      });
    });
  }

  openModalAward() {
    this.showModalAward = true;
    this.awardToEdit = null;
  }

  closeModalAward() {
    this.showModalAward = false;
    this.awardToEdit = null; 
  }

  openModalProject() {
    this.showModalProject = true;
  }

  closeModalProject() {
    this.showModalProject = false;
  }

  editAward(award: Award) {
    this.awardToEdit = {...award}; 
    this.showModalAward = true;
  }

  removeAward(awardId: number){
    if (!awardId) return;
    if (confirm('Tem certeza que deseja remover este prêmio?')) {
      this.awardService.removeAward(awardId).subscribe({
        next: () => {
          console.log('Prêmio removido com sucesso:', awardId);
          this.loadProjectDetails(this.projectId); 
        },
        error: (err) => {
          console.error('Erro ao remover prêmio:', err);
        }
      });
    }
  }

  handleAwardSaved(): void {
    this.loadProjectDetails(this.projectId); 
    this.closeModalAward();
  }

  generateCards(): void{
    const cardDataToSend: NumberCard = {
      project: this.projectId // Assumindo que 'this.projectId' é o ID do projeto
    }

    this.cardService.createCard(this.qtdCartelas, cardDataToSend, this.verifycarTypeCard()).subscribe({
      next: (data: ArrayBuffer) => {
        this.downloadPDF(data, 'cartelas_bingo.pdf');
      },
      error: (err) => {
        console.log("Erro ao gerar cartelas: ", err);
      }
    })
    console.log("Números de cartelas: ", this.qtdCartelas);
  }

  private downloadPDF(data: ArrayBuffer, filename: string): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  verifycarTypeCard(): number{
    if (this.tipoCartela == "cardUniqForAllAwards"){
      return 1
    }
    else{
      return 2
    }
  }

}
