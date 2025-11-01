import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ModalLayoutComponent } from '../modal-layout/modal-layout.component';
import { ModalInputComponent } from "../modal-input/modal-input.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalLayoutComponent,
    ModalInputComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit, OnChanges {

  projectForm!: FormGroup;
  isEditing = false;

  @Input() projectToEdit: Project | null = null;
  
  @Input() show = false;
  
  @Output() close = new EventEmitter<void>();
  
  @Output() projectSaved = new EventEmitter<Project>();

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private fb: FormBuilder,
    // Removida a injeção direta de WorkspaceComponent: use @Output() para comunicação com o pai.
  ){}

  ngOnInit(): void{
    this.initializeForm();
  }
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectToEdit'] && this.projectToEdit) {
      this.isEditing = true;
      this.patchForm(this.projectToEdit);
      console.log(this.projectToEdit)
    } else if (!this.projectToEdit) {
      this.isEditing = false;
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      amountAwards: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      description: ['', [Validators.required]],
      value: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  patchForm(project: Project): void {
    const [datePart, timePart] = project.dateAndTime.split('T');
    this.projectForm.patchValue({
      name: project.name,
      amountAwards: project.amountAwards,
      date: datePart || '',
      time: timePart ? timePart.substring(0, 5) : '',
      description: project.description,
      value: project.value,
      status: project.status,
      id: project.id
    });
  }
  
  get modalTitle(): string {
    return this.isEditing ? 'Editar Projeto' : 'Cadastrar Novo Projeto';
  }

  onSubmit() {
    if (this.projectForm.valid){
      const formValue = this.projectForm.value;

      const dateAndTime = `${formValue.date}T${formValue.time}`;
      const projectPayload: any = {
        ...formValue,
        dateAndTime,
      };

      delete projectPayload.date;
      delete projectPayload.time;

      if (this.isEditing && this.projectToEdit?.id) {
        this.projectService.updateProject(this.projectToEdit.id, projectPayload).subscribe({
          next: (response) => {
            console.log("Projeto atualizado com sucesso!", response);
            this.projectSaved.emit(response);
            this.close.emit();
          },
          error: (err) => {
            console.error("Erro ao atualizar projeto.", err);
          }
        });
      } else {
        this.projectService.createProject(projectPayload).subscribe({
          next: (response: Project) => {
            console.log("Projeto cadastrado com sucesso!", response);
            
            this.projectService.notifyProjectCreated(response);
            
            this.projectSaved.emit(response);
            this.close.emit();

            this.router.navigate(["/workspace/projects", response.id]);
          },
          error: (err) => {
            console.error("Erro ao cadastrar projeto.", err);
          }
        });
      }
    } else {
      console.log("❌ Formulário inválido.");
      this.projectForm.markAllAsTouched();
    }
  }

}