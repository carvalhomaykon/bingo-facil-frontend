import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit{

  project!: Project;
  projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
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
  }
  

}
