import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.initial_length = 1;
    this.param_length = 1;
    this.column_length = 1;
    this.button_length = 1;

    this.apiForm = this.formBuilder.group({
      url: ['', Validators.required],
      initial: this.formBuilder.group({
        initialValue: [''],
        initialType: ['']
      }),
      params: this.formBuilder.array([this.createParamGroup()]),
      columns: this.formBuilder.array([this.createColumnsGroup()]),
      headers: this.formBuilder.array(['User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0']),
      buttons: this.formBuilder.array([this.createButtonGroup()]),
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

  createParamGroup(): FormGroup {
    return this.formBuilder.group({
      param1: ['', Validators.required],
      param2: [''],
      param3: ['', Validators.required],
      param4: ['', Validators.required]
    });
  }

  createButtonGroup(): FormGroup {
    return this.formBuilder.group({
      buttonClass: ['', Validators.required],
      buttonType: ['', Validators.required],
      buttonValue: ['', Validators.required]
    });
  }

  createColumnsGroup(): FormGroup {
    return this.formBuilder.group({
      columnName: ['', Validators.required]
    });
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
    if (this.apiForm.invalid) {
      alert('Form is invalid');
      return;
    }

    let formData = this.apiForm.value;
    const payload = {
      "url": formData.url,
      initial: [formData.initial.initialValue, formData.initial.initialType],
      params: formData.params.map((param: any) => [param.param1, param.param2, param.param3, param.param4]),
      columns: formData.columns.map((column: any) => column.columnName),
      headers: formData.headers,
      buttons: formData.buttons.map((button: any) => [button.buttonClass, button.buttonType, button.buttonValue]),
      format: formData.format,
      scrape_type: formData.scrapeType,
      num_start: formData.numStart
    };
    console.log(payload);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json'
    };
    
    this.http.post<Blob>(`http://54.211.3.132/scrape/forall`, payload, httpOptions)
      .subscribe((response: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = 'data.csv';
        a.click();
        URL.revokeObjectURL(objectUrl);
      }, error => {
        console.error('Scrape error:', error);
      });
  }

}
