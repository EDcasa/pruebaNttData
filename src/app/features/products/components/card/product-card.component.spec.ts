import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { ProductService } from '../../../../core/services/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../../../core/models/product.model';

describe('ProductCardComponent (Jest)', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 'uno',
    name: 'Tarjeta Visa',
    description: 'Tarjeta internacional para consumo',
    logo: 'http://logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockProductService: Partial<ProductService> = {
    getAll: jest.fn().mockReturnValue(of([])),
    getById: jest.fn().mockReturnValue(of(null)),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: 'ProductService', useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    component['productService'] = mockProductService as ProductService;
    component['router'] = mockRouter as any;
    fixture.detectChanges();
  });

  it('should render product details correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Tarjeta Visa');
    expect(compiled.querySelector('p')?.textContent).toContain('Tarjeta internacional');
  });

  it('should toggle menu when toggleMenu is called', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
  });

  it('should emit deleted event after confirming deletion', () => {
    const emitSpy = jest.spyOn(component.deleted, 'emit');
    component.showModal = true;
    component.deleteProduct();
    expect(mockProductService.delete).toHaveBeenCalledWith('uno');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call router.navigate to edit product', () => {
    component.edit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit', 'uno']);
  });

  it('should open the delete confirmation modal', () => {
    component.confirmDelete();
    expect(component.showModal).toBe(true);
    expect(component.menuOpen).toBe(false);
  });
});
