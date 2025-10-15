import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, ProjectService } from '../../../services/project/project.service';
import { ModalLayoutComponent } from '../modal-layout/modal-layout.component';
import { ModalInputComponent } from "../modal-input/modal-input.component";
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from '../workspace/workspace.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalLayoutComponent,
    ModalLayoutComponent,
    ModalInputComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {

  projectForm!: FormGroup;

  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private workspace: WorkspaceComponent
  ){}

  ngOnInit(): void{
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      amountAwards: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      description: ['', [Validators.required]],
      value: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.projectForm.valid){

      const formValue = this.projectForm.value;
      console.log(formValue);

      const dateAndTime = `${formValue.date}T${formValue.time}`;
      console.log(dateAndTime);

      const projectPayload = {
        ...formValue,
        dateAndTime,
      };

      delete projectPayload.date;
      delete projectPayload.time;

      this.projectService.createProject(projectPayload).subscribe({
        next: (response:Project) => {
          console.log("Projeto cadastrado com sucesso!", response);
          
          this.projectService.notifyProjectCreated(response);
          
          this.workspace.closeModalProjetc();

          this.router.navigate(["/workspace/projects", response.id])
        },
        error: (err) => {
          console.log("Erro ao cadastrar projeto.", err)
        }
      })
    } else {
      console.log("❌ Formulário inválido. Detalhes abaixo:");

      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key);
        if (control && control.invalid) {
          console.log(`- Campo '${key}' é inválido. Valor atual:`, control.value);
          console.log(`  Erros:`, control.errors);
        }
      });

      this.projectForm.markAllAsTouched();
    }
  }

}
