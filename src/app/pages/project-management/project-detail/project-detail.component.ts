import { Component, Input, OnInit } from '@angular/core';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Award, AwardService } from '../../../services/award/award.service';
import { AwardModalComponent } from "../award-modal/award-modal.component";
import { ProjectModalComponent } from "../project-modal/project-modal.component";

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
    ProjectModalComponent
],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit{

  @Input() ngClass: string = "";
  
  showModalAward = false;
  showModalProject = false;

  project!: Project;
  projectId!: number; 
  awards: Award[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private awardService: AwardService
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
    this.projectService.getProjectById(id).subscribe(data => {
      this.project = data;
    });
    this.awardService.getAwardsByIdProject(id).subscribe(dataAward => {
      this.awards = dataAward;
    })
  }

  openModalAward() {
    this.showModalAward = true;
  }

  closeModalAward() {
    this.showModalAward = false;
  }

  openModalProject() {
    this.showModalProject = true;
  }

  closeModalProject() {
    this.showModalProject = false;
  }

}
