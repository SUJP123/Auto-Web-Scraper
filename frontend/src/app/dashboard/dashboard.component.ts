import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  apiForm: FormGroup;
  initial_length: number;
  param_length: number;
  column_length: number;
  button_length: number;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient
  ) {
    this.initial_length = 1,
    this.param_length = 1,
    this.column_length = 1,
    this.button_length = 1,
    this.apiForm = this.fb.group({
      url: ['', Validators.required],
      initial: this.fb.array([this.createInitialGroup()]),
      params: this.fb.array([this.createParamGroup()]),
      columns: this.fb.array([this.createColumnsGroup()]),
      headers: ['', Validators.required],
      buttons: this.fb.array([this.createButtonGroup()]),
      format: ['', Validators.required],
      scrapeType: ['', Validators.required],
      numStart: [0, Validators.required],
    });
  }

  ngOnInit(): void {}

  get initial(): FormArray {
    return this.apiForm.get('initial') as FormArray;
  }

  get params(): FormArray {
    return this.apiForm.get('params') as FormArray;
  }

  get buttons(): FormArray {
    return this.apiForm.get('buttons') as FormArray;
  }

  get columns(): FormArray {
    return this.apiForm.get('columns') as FormArray;
  }

  createInitialGroup(): FormGroup {
    return this.fb.group({
      initialValue: [''],
      initialType: ['', Validators.required]
    });
  }

  createParamGroup(): FormGroup {
    return this.fb.group({
      param1: ['', Validators.required],
      param2: [''],
      param3: ['', Validators.required],
      param4: ['', Validators.required]
    });
  }

  createButtonGroup(): FormGroup {
    return this.fb.group({
      buttonClass: [''],
      buttonType: ['' ],
      buttonValue: ['']
    });
  }

  createColumnsGroup(): FormGroup {
    return this.fb.group({
      columnName: ['', Validators.required]
    });
  }

  addInitial() {
    this.initial_length += 1;
    this.initial.push(this.createInitialGroup());
  }

  addParam() {
    this.param_length += 1;
    this.params.push(this.createParamGroup());
  }

  addButton() {
    this.button_length += 1;
    this.buttons.push(this.createButtonGroup());
  }

  addColumn() {
    this.column_length += 1;
    this.columns.push(this.createColumnsGroup());
  }

  removeInitial(index: number) {
    if (this.initial_length > 1) {
      this.initial_length -= 1;
      this.initial.removeAt(index);
    }
  }

  removeParam(index: number) {
    if (this.param_length > 1) {
      this.param_length -= 1;
      this.params.removeAt(index);
    }
  }

  removeButton(index: number) {
    if (this.button_length > 1) {
      this.button_length -= 1;
      this.buttons.removeAt(index);
    }
  }

  removeColumn(index: number) {
    if (this.column_length > 1) {
      this.column_length -= 1;
      this.columns.removeAt(index);
    }
  }

  navigateToDemo() {
    this.router.navigate(['/demo']);
  }

  onSubmit() {
    let formData = this.apiForm.value;
    const payload = {
      url: formData.url,
      initial: formData.initial.map((init: any) => ({ value: init.initialValue, type: init.initialType })),
      params: formData.params.map((param: any) => [param.param1, param.param2, param.param3, param.param4]),
      columns: formData.columns.map((column: any) => column.columnName),
      headers: formData.headers,
      buttons: formData.buttons.map((button: any) => ({ class: button.buttonClass, type: button.buttonType, value: button.buttonValue })),
      format: formData.format,
      scrape_type: formData.scrapeType,
      num_start: formData.numStart
    };

    this.http.post('http://127.0.0.1:8000/scrape/forall', payload)
      .subscribe(response => {
        console.log('Scrape response:', response);
      }, error => {
        console.error('Scrape error:', error);
      });
  }

}
