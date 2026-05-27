import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Canvas, FabricText, FabricImage, Rect, Group, Line } from 'fabric'; // Adicionado Line
import { Project, ProjectService } from '../../../services/project/project.service';
import { Award, AwardService } from '../../../services/award/award.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemplateCard, TemplateCardService } from '../../../services/template-card/template-card.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../services/notification/notification.service';
import { CardStyle } from '../../../services/card/card.service';

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-editor.component.html',
})
export class CardEditorComponent implements OnInit, AfterViewInit {
  canvas!: Canvas;
  project!: Project;
  projectId!: number;
  awards: Award[] = [];
  selectedFile: File | null = null;
  mainGridGroup: Group | null = null;
  templateId: number | null = null;
  renderedCardsCount: number = 0;
  
  // Lista para monitorar e limpar as linhas guias da tela
  private guideLines: Line[] = []; 
  // Distância em pixels para ativar a atração (snap)
  private snapTolerance: number = 10; 

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
        this.initializeData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvas = new Canvas('mainCanvas', {
      backgroundColor: '#ffffff',
      width: 500,
      height: 600,
    });

    // Ativa a funcionalidade de linhas guias inteligentes
    this.setupSmartGuides();
  }

  get totalCards(): number {
    if (!this.project || !this.awards) return 0;
    return this.project.styleCard === 'SINGLE_CARD_FOR_ALL_AWARDS' ? 1 : this.awards.length;
  }

  /**
   * Configura os ouvintes de eventos para criar as linhas magnéticas de alinhamento
   */
  private setupSmartGuides(): void {
    this.canvas.on('object:moving', (e) => {
      const activeObject = e.target as Group;
      if (!activeObject || activeObject.type !== 'group') return;

      this.clearGuideLines();

      const objects = this.canvas.getObjects('group') as Group[];
      const activeCenter = activeObject.getCenterPoint();

      let snappedX = false;
      let snappedY = false;

      for (const obj of objects) {
        if (obj === activeObject) continue;

        const targetCenter = obj.getCenterPoint();

        // ---- ALINHAMENTO HORIZONTAL (EIXO Y - Topo com Topo, Centro com Centro) ----
        if (!snappedY) {
          // Topo com Topo
          if (Math.abs(activeObject.top - obj.top) < this.snapTolerance) {
            activeObject.set({ top: obj.top });
            this.showGuideLine(0, obj.top, this.canvas.width, obj.top);
            snappedY = true;
          }
          // Centro com Centro Horizontal
          else if (Math.abs(activeCenter.y - targetCenter.y) < this.snapTolerance) {
            activeObject.set({ top: targetCenter.y - (activeObject.height * activeObject.scaleY) / 2 });
            this.showGuideLine(0, targetCenter.y, this.canvas.width, targetCenter.y);
            snappedY = true;
          }
        }

        // ---- ALINHAMENTO VERTICAL (EIXO X - Esquerda com Esquerda, Centro com Centro) ----
        if (!snappedX) {
          // Esquerda com Esquerda
          if (Math.abs(activeObject.left - obj.left) < this.snapTolerance) {
            activeObject.set({ left: obj.left });
            this.showGuideLine(obj.left, 0, obj.left, this.canvas.height);
            snappedX = true;
          }
          // Centro com Centro Vertical
          else if (Math.abs(activeCenter.x - targetCenter.x) < this.snapTolerance) {
            activeObject.set({ left: targetCenter.x - (activeObject.width * activeObject.scaleX) / 2 });
            this.showGuideLine(targetCenter.x, 0, targetCenter.x, this.canvas.height);
            snappedX = true;
          }
        }
      }

      if (snappedX || snappedY) {
        activeObject.setCoords();
        this.canvas.renderAll();
      }
    });

    // Limpa as linhas vermelhas/guias assim que o usuário solta o clique do mouse
    this.canvas.on('object:modified', () => this.clearGuideLines());
  }

  /**
   * Desenha uma linha guia temporária pontilhada na tela
   */
  private showGuideLine(x1: number, y1: number, x2: number, y2: number): void {
    const line = new Line([x1, y1, x2, y2], {
      stroke: '#ff4d4d', // Cor vermelha estilo Canva/Adobe
      strokeWidth: 1,
      selectable: false,
      evented: false,
      strokeDashArray: [4, 4], // Deixa a linha tracejada
    });

    this.canvas.add(line);
    this.guideLines.push(line);
  }

  /**
   * Remove todas as linhas guias ativas no canvas
   */
  private clearGuideLines(): void {
    this.guideLines.forEach(line => this.canvas.remove(line));
    this.guideLines = [];
    this.canvas.renderAll();
  }

  private initializeData(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (projectData) => {
        this.project = projectData;
        this.loadAwardsAndTemplate();
      },
      error: () => this.notificationService.show('Erro ao carregar projeto.', 'error')
    });
  }

  private loadAwardsAndTemplate(): void {
    this.awardService.getAwardsByIdProject(this.projectId).subscribe({
      next: (awardData) => {
        this.awards = awardData;
        this.renderGridsBasedOnStyle();
        this.loadExistingTemplate();
      },
      error: () => this.notificationService.show('Erro ao carregar prêmios.', 'error')
    });
  }

  private loadExistingTemplate(): void {
    this.templateCardService.getTemplateCardByIdProject(this.projectId).subscribe({
      next: (template: TemplateCard) => {
        if (template?.backgroundImagePath) {
          this.applyBackgroundImage(template.backgroundImagePath).then(() => {
            if (template.layoutConfig) {
              const config = JSON.parse(template.layoutConfig);
              this.templateId = template.id || null;
              this.applySavedLayout(config);
            }
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          console.log('Projeto novo: nenhum template encontrado.');
        } else {
          this.notificationService.show('Erro ao buscar template.', 'error');
        }
      }
    });
  }

  private applySavedLayout(config: any[]): void {
    const existingGroups = this.canvas.getObjects('group') as Group[];
    existingGroups.forEach(g => this.canvas.remove(g));
    this.renderedCardsCount = 0;

    config.forEach((item, index) => {
      this.createBingoGridGroup(index);
      
      const groups = this.canvas.getObjects('group') as Group[];
      const addedGroup = groups[groups.length - 1];

      if (addedGroup) {
        addedGroup.set({
          left: item.x,
          top: item.y,
          scaleX: item.scaleX,
          scaleY: item.scaleY
        });
        addedGroup.setCoords();
      }
      this.renderedCardsCount++;
    });
    
    this.canvas.renderAll();
  }

  private async applyBackgroundImage(url: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const encodedUrl = encodeURI(url);
        const img = await FabricImage.fromURL(encodedUrl, { crossOrigin: 'anonymous' });

        const maxWidth = 800; 
        let scale = 1;

        if (img.width! > maxWidth) {
          scale = maxWidth / img.width!;
        }

        const finalWidth = img.width! * scale;
        const finalHeight = img.height! * scale;

        this.canvas.setDimensions({ width: finalWidth, height: finalHeight });

        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: 'left',
          originY: 'top'
        });

        this.canvas.backgroundImage = img;
        this.canvas.renderAll();
        resolve();
      } catch (e) {
        console.error(e);
        this.notificationService.show('Erro ao renderizar imagem de fundo.', 'error');
      }
    });
  }

  async onLoadTemplate(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      await this.applyBackgroundImage(data);
    };
    reader.readAsDataURL(file);
  }

  saveLayout(): void {
    if (!this.selectedFile && !this.canvas.backgroundImage) {
      this.notificationService.show('Selecione uma imagem de fundo primeiro.', 'error');
      return;
    }

    const grids = this.canvas.getObjects('group') as Group[];
    const layoutConfig = this.mapGridsToLayout(grids);

    if (this.selectedFile) {
      this.templateCardService.saveBackgroundImagePath(this.selectedFile).subscribe({
        next: (response) => this.persistTemplate(response.url, layoutConfig),
        error: () => this.notificationService.show('Erro no upload da imagem.', 'error')
      });
    } else {
      const backgroundImage = this.canvas.backgroundImage as any;
      const currentImg = backgroundImage ? (backgroundImage.getSrc() || '') : '';
      this.persistTemplate(currentImg, layoutConfig);
    }
  }

  private persistTemplate(imageUrl: string, config: any): void {
    const templateData: TemplateCard = {
      project: this.projectId,
      backgroundImagePath: imageUrl,
      layoutConfig: JSON.stringify(config)
    };

    const request = this.templateId
      ? this.templateCardService.updateTemplateCard(this.templateId, templateData)
      : this.templateCardService.saveTemplateCard(templateData);

    request.subscribe({
      next: () => {
        this.notificationService.show('Template salvo com sucesso!', 'success');
        setTimeout(() => this.navigateToItem(), 1000);
      },
      error: () => this.notificationService.show('Erro ao processar template.', 'error')
    });
  }

  private mapGridsToLayout(grids: Group[]) {
    return grids.map((g, index) => {
      const award = this.awards[index];

      return {
        x: g.left,
        y: g.top,
        scaleX: g.scaleX,
        scaleY: g.scaleY,
        width: g.width * g.scaleX,
        height: g.height * g.scaleY,
        awardId: award ? award.id : null,
        awardName: award ? award.name : null,
        awardDonor: award ? award.donor : null,
        styleConfig: {
          rectFill: '#ffffff',
          rectStroke: '#dc2626',
          textColor: '#1f2937',
          fontFamily: 'Times New Roman',
          headerFill: '#dc2626',
          headerTextColor: '#ffffff',
          borderColor: '#dc2626'
        }
      };
    });
  }

  renderGridsBasedOnStyle(): void {
    if (!this.canvas) return;
    
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.renderedCardsCount = 0;
  }

  createBingoGridGroup(index: number, style?: CardStyle) {
    const size = 5;
    const cellSize = 50;
    const objects: any[] = [];
    
    const activeStyle: Required<CardStyle> = {
      rectFill: style?.rectFill || '#ffffff',
      rectStroke: style?.rectStroke || '#dc2626',
      textColor: style?.textColor || '#1f2937',
      fontFamily: style?.fontFamily || 'Times New Roman',
      headerFill: style?.headerFill || '#dc2626',
      headerTextColor: style?.headerTextColor || '#ffffff',
      borderColor: style?.borderColor || '#dc2626'
    };

    const totalWidth = size * cellSize;
    const totalGridHeight = (size + 1) * cellSize;

    const cardBg = new Rect({
      left: 0,
      top: 0,
      width: totalWidth,
      height: totalGridHeight,
      fill: activeStyle.borderColor,
      stroke: activeStyle.borderColor,
      strokeWidth: 2
    });
    objects.push(cardBg);

    this.generateBingoHeader(objects, size, cellSize, activeStyle);
    this.generateBingoGrid(objects, size, cellSize, activeStyle);
    this.generateCenterCell(objects, cellSize, activeStyle);
    this.generateAwardText(objects, index, size, cellSize, activeStyle);
    this.renderGridGroup(objects, index, size, cellSize);
  }

  private generateBingoHeader(objects: any[], size: number, cellSize: number, style: Required<CardStyle>) {
    const bingoLetters = ['B', 'I', 'N', 'G', 'O'];

    for (let col = 0; col < size; col++) {
      const headerRect = new Rect({
        left: col * cellSize,
        top: 0,
        width: cellSize,
        height: cellSize,
        fill: style.headerFill,
        stroke: style.rectStroke,
        strokeWidth: 1.5,
      });

      const headerText = new FabricText(bingoLetters[col], {
        left: col * cellSize + (cellSize / 2),
        top: cellSize / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        fill: style.headerTextColor,
        fontFamily: style.fontFamily
      });

      objects.push(headerRect, headerText);
    }
  }

  private generateBingoGrid(objects: any[], size: number, cellSize: number, style: Required<CardStyle>) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isCenter = row === 2 && col === 2;
        const currentTop = (row + 1) * cellSize; 

        const rect = new Rect({
          left: col * cellSize,
          top: currentTop,
          width: cellSize,
          height: cellSize,
          fill: style.rectFill,
          stroke: style.rectStroke,
          strokeWidth: 1,
        });

        objects.push(rect);

        if (!isCenter) {
          const num = new FabricText('', {
            left: col * cellSize + (cellSize / 2),
            top: currentTop + (cellSize / 2),
            originX: 'center',
            originY: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            fill: style.textColor,
            fontFamily: style.fontFamily
          });
          objects.push(num);
        }
      }
    }
  }

  private generateCenterCell(objects: any[], cellSize: number, style: Required<CardStyle>) {
    const centerTop = 3 * cellSize;
    const centerLeft = 2 * cellSize;

    const logoPlaceholder = new FabricText('★', {
      left: centerLeft + (cellSize / 2),
      top: centerTop + (cellSize / 2),
      originX: 'center',
      originY: 'center',
      fontSize: 26,
      fontWeight: '900',
      fill: '#f59e0b',
    });
    
    objects.push(logoPlaceholder);
  }

  private generateAwardText(objects: any[], index: number, size: number, cellSize: number, style: any) {
    const awardName = this.awards[index]?.name 
      ? `${index + 1}º Prêmio: ${this.awards[index].name}` 
      : `Prêmio ${index + 1}`;
      
    const awardDonor = `Doador(es): ${this.awards[index]?.donor || 'Anônimo(a)'}`;
    const totalGridHeight = (size + 1) * cellSize;

    const createFabricText = (text: string, currentTop: number, isSecondary = false) => {
      return new FabricText(isSecondary ? text : text.toUpperCase(), {
        left: (size * cellSize) / 2,
        top: currentTop, 
        originX: 'center',
        fontSize: 14,
        fontWeight: isSecondary ? 'normal' : 'bold',
        fill: style.textColor,
        fontFamily: style.fontFamily,
      });
    };

    const awardTextObj = createFabricText(awardName, totalGridHeight + 15);
    objects.push(awardTextObj);

    const donorTextObj = createFabricText(awardDonor, totalGridHeight + 35, true);
    objects.push(donorTextObj);
  }

  private renderGridGroup(objects: any[], index: number, size: number, cellSize: number) {
    const offset = (this.renderedCardsCount % 5) * 20;
    
    const group = new Group(objects, {
      left: 50 + offset,
      top: 50 + offset,
      selectable: true,
      subTargetCheck: false
    });

    group.on('scaling', () => this.syncAllGrids(group));
    
    this.canvas.add(group);
    if (index === 0) this.mainGridGroup = group;
    this.canvas.renderAll();
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

  clearCanvas() {
    if(confirm('Deseja realmente limpar tudo?')) {
      this.canvas.clear();
      this.canvas.backgroundColor = '#ffffff';
      this.canvas.backgroundImage = undefined;
      this.canvas.renderAll();
    }
  }

  navigateToItem() {
    this.router.navigate(['workspace/projects', this.projectId]);
  }

  addNextCard(): void {
    if (this.renderedCardsCount >= this.totalCards) {
      this.notificationService.show('Todas as cartelas já foram adicionadas à tela.', 'info');
      return;
    }

    this.createBingoGridGroup(this.renderedCardsCount);
    this.renderedCardsCount++;
  }
}