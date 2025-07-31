import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../../core/services/product.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Mock Data
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Description 1',
    logo: 'logo1.png',
    date_release: '2022-01-01',
    date_revision: '2022-02-01'
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Description 2',
    logo: 'logo2.png',
    date_release: '2022-03-01',
    date_revision: '2022-04-01'
  }
];

// Mock Services
const mockProductService = {
  getAll: jest.fn().mockReturnValue(of({ data: mockProducts })),
  delete: jest.fn().mockReturnValue(of({ success: true }))
};

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        RouterTestingModule,
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.products()).toEqual(mockProducts);
    expect(component.loading()).toBe(false);
  });

  it('should filter products by search term', () => {
    component.searchTerm.set('product 1');
    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Test Product 1');
  });

  it('should change page size and reset current page', () => {
    component.currentPage.set(2);
    component.changePageSize(10);
    expect(component.pageSize()).toBe(10);
    expect(component.currentPage()).toBe(1);
  });

  it('should go to previous and next page', () => {
    component.pageSize.set(1);
    component.currentPage.set(2);
    component.prevPage();
    expect(component.currentPage()).toBe(1);

    component.nextPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should show modal and select product for deletion', () => {
    component.delete('1');
    expect(component.showModal).toBe(true);
    expect(component.productSelected.id).toBe('1');
  });

  it('should call deleteProduct and reload', () => {
    jest.spyOn(component, 'loadProducts');
    component.productSelected = mockProducts[0];
    component.deleteProduct();
    expect(mockProductService.delete).toHaveBeenCalledWith('1');
    expect(component.showModal).toBe(false);
    expect(component.loadProducts).toHaveBeenCalled();
  });
});
