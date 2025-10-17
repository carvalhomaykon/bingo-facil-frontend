import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalLayoutComponent } from '../../workspace/modal-layout/modal-layout.component';
import { ModalInputComponent } from '../../workspace/modal-input/modal-input.component';
import { Award, AwardService } from '../../../services/award/award.service';
import { Project } from '../../../services/project/project.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-award-modal',
  standalone: true,
  imports: [
    ModalLayoutComponent,
    ReactiveFormsModule
  ],
  templateUrl: './award-modal.component.html',
  styleUrl: './award-modal.component.scss'
})
export class AwardModalComponent implements OnInit, OnChanges{

  @Input() awardToEdit: Award | null = null;

  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Input() awards: Award[] = [];
  @Input() idProject: number = 0;
  @Input() awardsProject: number = 0;
  @Output() awardSaved = new EventEmitter<void>();

  public formAward !: FormGroup;


  constructor(
    private awardService: AwardService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.formAward = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      styleAward: ['', Validators.required],
      project: [this.idProject],
    })
  }

  onSubmit(): void {
    if (this.formAward.valid) {

      const formValue = this.formAward.value;
      const awardId = formValue.id;

      let saveObservable;
      
      if (awardId){
        saveObservable = this.awardService.updateAward(awardId, formValue);
      } else{
        saveObservable = this.awardService.saveAwards(formValue);
      }

      saveObservable.subscribe({
        next: (response) => {
          console.log('Award salvo/atualizado com sucesso!', response);
          this.awardSaved.emit();
          this.close.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar award:', err);
        }
      });
      
    } else {
      console.error('Formulário inválido!');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show && this.formAward) {
      this.resetForm();

      if (this.awardToEdit) {
        this.formAward.patchValue({
          id: this.awardToEdit.id,
          name: this.awardToEdit.name,
          styleAward: this.awardToEdit.styleAward,
        });
        console.log('Modal em modo EDIÇÃO:', this.awardToEdit);
      } else {
        console.log('Modal em modo CADASTRO.');
      }
    }
  }

  resetForm(): void {
    this.formAward.reset({
      id: null,
      name: '',
      styleAward: '',
      project: this.idProject
    });
  }

}
