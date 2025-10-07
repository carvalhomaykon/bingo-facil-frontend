import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ProjectComponent } from '../project/project.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  private subscription!: Subscription;

  constructor(
    private projectService: ProjectService
  ){}

  ngOnInit(): void {
    this.loadProjects();

    this.subscription = this.projectService.projectCreated$.subscribe(
      (newProject: Project) => {
        this.projets.unshift(newProject);
      }
    )
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  loadProjects(): void {
    this.projectService.listarProjetos().subscribe(data => {
      this.projets = data;
    })
  }

  openModalProject() {
    this.showModalProject = true;
  }

  closeModalProjetc() {
    this.showModalProject = false;
  }

}
