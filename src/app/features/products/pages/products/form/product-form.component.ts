import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isEdit = signal(false);
  titlePage = signal('Formulario de Registro');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!id);

    this.form = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        this.idValidator()
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.minTodayValidator()]],
      date_revision: ['', [Validators.required, this.oneYearAfterReleaseValidator()]],
    });

    if (this.isEdit()) {
      this.form.get('id')?.disable();
      this.productService.getById(id!).subscribe(res => this.form.patchValue(res));
      this.titlePage.set('Formulario de Edición');
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = {
      ...this.form.getRawValue(),
    } as Product;

    if (this.isEdit()) {
      this.productService.update(formData.id, formData).subscribe(() => {
        this.router.navigateByUrl('/');
      });
    } else {
      this.productService.create(formData).subscribe(() => {
        this.router.navigateByUrl('/');
      });
    }
  }

  idValidator(): AsyncValidatorFn {
    return control => {
      if (this.isEdit()) return of(null);
      return this.productService.checkIdExists(control.value).pipe(
        map(exists => (exists ? { idTaken: true } : null))
      );
    };
  }

  minTodayValidator() {
    return (control: AbstractControl) => {
      const today = new Date().toISOString().split('T')[0];
      return control.value >= today ? null : { minDate: true };
    };
  }

  oneYearAfterReleaseValidator() {
    return (control: AbstractControl) => {
      const release = this.form?.get('date_release')?.value;
      if (!release || !control.value) return null;
      const releaseDate = new Date(release);
      const expectedDate = new Date(releaseDate);
      expectedDate.setFullYear(releaseDate.getFullYear() + 1);
      return new Date(control.value).toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]
        ? null : { invalidRevisionDate: true };
    };
  }

  onChangeDateRelease() {
    const dateRelease = this.form.get('date_release')?.value;
    if (dateRelease) {
      const releaseDate = new Date(dateRelease);
      const expectedRevisionDate = new Date(releaseDate);
      expectedRevisionDate.setFullYear(releaseDate.getFullYear() + 1);
      this.form.get('date_revision')?.setValue(expectedRevisionDate.toISOString().split('T')[0]);
    }
  }

  get id() { return this.form.get('id')!; }
  get name() { return this.form.get('name')!; }
  get description() { return this.form.get('description')!; }
  get logo() { return this.form.get('logo')!; }
  get date_release() { return this.form.get('date_release')!; }
  get date_revision() { return this.form.get('date_revision')!; }
}
