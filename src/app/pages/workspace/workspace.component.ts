import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Project, ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent implements OnInit{

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

}
