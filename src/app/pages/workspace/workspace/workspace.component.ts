import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ProjectComponent } from '../project/project.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    ProjectComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent implements OnInit{

  showModalProject = false;

  projets: Project[] = [];

  constructor(
    private projectService: ProjectService
  ){}

  ngOnInit(): void {
    this.projectService.listarProjetos().subscribe({
      next: (dados) => this.projets = dados,
      error: (err) => console.log('Erro ao buscar projetos', err)
    })
  }

  openModalProject() {
    this.showModalProject = true;
  }

  closeModalProjetc() {
    this.showModalProject = false;
  }

}
