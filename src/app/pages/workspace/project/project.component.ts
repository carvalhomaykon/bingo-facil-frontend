import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project/project.service';
import { ModalLayoutComponent } from '../modal-layout/modal-layout.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalLayoutComponent
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
    private fb: FormBuilder
  ){}

  ngOnInit(): void{
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      amountAwards: ['', [Validators.required]],
      dateAndTime: ['', [Validators.required]],
      description: ['', [Validators.required]],
      value: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

}
