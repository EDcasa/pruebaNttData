import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from '../form/product-form.component';
import { ProductService } from '../../../../../core/services/product.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


describe('ProductFormComponent (Jest)', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  const mockProductService = {
    getById: jest.fn(),
    checkIdExists: jest.fn().mockReturnValue(of(false)),
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(null),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')?.value).toBe('');
  });

  it('should mark name as invalid if too short', () => {
    component.form.get('name')?.setValue('abc');
    expect(component.form.get('name')?.invalid).toBe(true);
  });

  it('should mark description as invalid if too short', () => {
    component.form.get('description')?.setValue('desc');
    expect(component.form.get('description')?.invalid).toBe(true);
  });

  it('should call create on submit when not in edit mode and form is valid', () => {
    component.form.patchValue({
      id: 'prod123',
      name: 'Producto válido',
      description: 'Una descripción lo suficientemente larga',
      logo: 'http://logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    });

    component.onSubmit();

    expect(mockProductService.create).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod123' }));
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should NOT call create if form is invalid', () => {
    component.form.patchValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });

    component.onSubmit();

    expect(mockProductService.create).not.toHaveBeenCalled();
  });
});