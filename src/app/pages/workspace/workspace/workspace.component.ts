import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ProjectComponent } from '../project/project.component';
import { CommonModule } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { Card, CardService } from '../../../services/card/card.service';

interface CombinedItem{
  id: number;
  type: 'Projeto' | 'Bingo';
  name: String;
  dateAndTime: string;
  status: string;
  codeCard?: string;
}

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    ProjectComponent,
    CardComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent implements OnInit, OnDestroy{

  showModalProject = false;
  showModalCard = false;

  projets: Project[] = [];
  cards: Card[] = [];
  combinedItems: CombinedItem[] = [];

  private subscription!: Subscription;

  constructor(
    private projectService: ProjectService,
    private cardService: CardService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.loadData();

    this.subscription = this.projectService.projectCreated$.subscribe(
      (newProject: Project) => {
        this.loadData()
      }
    )
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadData(): void {
    forkJoin({
      projects: this.projectService.listarProjetos(),
      cards: this.cardService.getAllCards()
    }).subscribe(({projects, cards}) => {
      this.projets = projects;
      this.cards = cards;
      this.combineAndSortItems();
    })
  }

  combineAndSortItems(): void {
    this.combinedItems = [...this.normalizedProjects(), ...this.normalizedCards()];

    this.combinedItems.sort((a, b) => {
      return new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime();
    });

  }

  normalizedProjects(): CombinedItem[]{
    return this.projets.map(p => (
      {
        id: p.id,
        type: 'Projeto',
        name: p.name,
        dateAndTime: p.dateAndTime,
        status: p.status
      }
    ));
  }

  normalizedCards(): CombinedItem[]{
    return this.cards.map(c => (
      {
        id: c.id,
        type: 'Bingo',
        name: c.project.name, 
        dateAndTime: c.project.dateAndTime,
        status: c.project.status,
        codeCard: c.codeCard
      }
    ));
  }

  navigateToItem(item: CombinedItem): void {
    if (item.type === 'Projeto'){
      this.router.navigate(['workspace/projects', item.id]);
    }
    else{
      this.router.navigate(['workspace/card', item.codeCard]);
    }
  }

  openModalProject() {
    this.showModalProject = true;
  }

  closeModalProjetc() {
    this.showModalProject = false;
  }

  openModalCard() {
    this.showModalCard = true;
  }

  closeModalCard() {
    this.showModalCard = false;
  }

}
