import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Canvas, FabricText, FabricImage, Rect, Group, TPointerEventInfo} from 'fabric';
import { Project, ProjectService } from '../../../services/project/project.service';
import { Award, AwardService } from '../../../services/award/award.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemplateCard, TemplateCardService } from '../../../services/template-card/template-card.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../services/notification/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card-editor.component.html',
})

export class CardEditorComponent implements OnInit, AfterViewInit {
  canvas!: Canvas;

  project!: Project;
  projectId!: number;
  awards: Award[] = [];

  selectedText: FabricText | null = null;
  mainGridGroup: Group | null = null;

  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private awardService: AwardService,
    private templateCardService: TemplateCardService,
    private router: Router,
    private notificationService: NotificationService
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

  ngAfterViewInit(): void {
    this.canvas = new Canvas('mainCanvas', {
      backgroundColor: '#ffffff',
      width: 500,
      height: 600,
    });
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe(projectData => {
      this.project = projectData;

      this.awardService.getAwardsByIdProject(id).subscribe(awardData => {
        this.awards = awardData;
        this.renderGridsBasedOnStyle();
      });
    });
  }

  renderGridsBasedOnStyle(): void {
    if (!this.canvas) {
      return;
    } 
    
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';

    const style = this.project.styleCard;
    const numberOfGrids = style === 'SINGLE_CARD_FOR_ALL_AWARDS' ? 1 : this.awards.length;

    for (let i = 0; i < numberOfGrids; i++) {
      const label = style === 'SINGLE_CARD_FOR_ALL_AWARDS' ? 'Cartela Única' : `Prêmio: ${this.awards[i].name}`;
      this.createBingoGridGroup(i);
    }
  }

  createBingoGridGroup(index: number) {
    const size = 5;
    const cellSize = 50;
    const objects = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const rect = new Rect({
          left: col * cellSize,
          top: row * cellSize,
          width: cellSize,
          height: cellSize,
          fill: 'rgba(255,255,255,0.5)',
          stroke: '#9ca3af',
          strokeWidth: 1,
        });

        const num = new FabricText('00', {
          left: col * cellSize + (cellSize / 4),
          top: row * cellSize + (cellSize / 4),
          fontSize: 18,
          fill: '#4b5563',
        });
        objects.push(rect, num);
      }
    }

    const group = new Group(objects, {
      left: 50,
      top: 50 + (index * 350),
      selectable: true,
    });

    group.on('scaling', () => {
      this.syncAllGrids(group);
    });

    this.canvas.add(group);
    if (index === 0) this.mainGridGroup = group;
  }

  syncAllGrids(masterGroup: Group) {
    const objects = this.canvas.getObjects('group') as Group[];
    objects.forEach(obj => {
      if (obj !== masterGroup) {
        obj.set({
          scaleX: masterGroup.scaleX,
          scaleY: masterGroup.scaleY,
        });
      }
    });
    this.canvas.renderAll();
  }

  async onLoadTemplate(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;

      const img = await FabricImage.fromURL(data);
      this.canvas.setDimensions({ width: img.width!, height: img.height! });
      this.canvas.backgroundImage = img;
      this.canvas.renderAll();
    };
    reader.readAsDataURL(file);
  }
  
  saveLayout(): void {
    if (!this.selectedFile) {
      this.notificationService.show('Por favor, selecione uma imagem de fundo primeiro.', 'error');
      return;
    }

    const grids = this.canvas.getObjects('group') as Group[];

    const layoutConfig = grids.map(g => {
      const label = g.getObjects().find(o => (o as any).name === 'awardLabel') as FabricText;
      return {
        x: g.left,
        y: g.top,
        scaleX: g.scaleX,
        scaleY: g.scaleY,
        textConfig: label ? {
          visible: true,
          color: label.fill,
          fontSize: label.fontSize,
          fontFamily: label.fontFamily
        } : { visible: false }
      };
    });

    this.saveBackgroundImagePath(this.selectedFile).subscribe({
      next: (response) => {
        const templateData: TemplateCard = {
          project: this.projectId,
          backgroundImagePath: response.url,
          layoutConfig: JSON.stringify(layoutConfig)
        };
        
        this.saveTemplateCard(templateData);
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        this.notificationService.show('Falha ao fazer upload da imagem.', 'error');
      }
    })

  }

  clearCanvas() {
    if(confirm('Deseja realmente limpar tudo?')) {
      this.canvas.clear();
      this.canvas.backgroundColor = '#ffffff';
      this.canvas.renderAll();
    }
  }

  saveBackgroundImagePath(file: File): Observable<any>{
    return this.templateCardService.saveBackgroundImagePath(file);
  }

  saveTemplateCard(data: TemplateCard){
    this.templateCardService.saveTemplateCard(data).subscribe({
      next: () => {
        this.notificationService.show('Dados salvos com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            this.navigateToItem();
          }, 1000);
      },
      error: () => {
        const errorMessage ='Erro ao salvar os dados. Tente novamente.';
        this.notificationService.show(errorMessage, 'error');
      }
    })
  }

  navigateToItem() {
    this.router.navigate(['workspace/projects', this.projectId]);
  }

}