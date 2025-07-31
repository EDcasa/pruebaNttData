import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya llamadas pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET list of products', () => {
    const dummyProducts: Product[] = [
      { id: '1', name: 'Prod 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2022-01-01', date_revision: '2022-02-01' },
      { id: '2', name: 'Prod 2', description: 'Desc 2', logo: 'logo2.png', date_release: '2022-03-01', date_revision: '2022-04-01' },
    ];

    service.getAll().subscribe(res => {
      expect(res.data.length).toBe(2);
      expect(res.data).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProducts });
  });

  it('getById should GET a single product by id', () => {
    const dummyProduct: Product = { id: '1', name: 'Prod 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2022-01-01', date_revision: '2022-02-01' };

    service.getById('1').subscribe(res => {
      expect(res.data).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProduct });
  });

  it('create should POST a new product', () => {
    const newProduct: Product = { id: '3', name: 'Prod 3', description: 'Desc 3', logo: 'logo3.png', date_release: '2022-05-01', date_revision: '2022-06-01' };

    service.create(newProduct).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ success: true });
  });

  it('update should PUT updated product data', () => {
    const updatedProduct = { name: 'Prod Updated', description: 'Desc Updated', logo: 'logo-updated.png', date_release: '2022-05-01', date_revision: '2022-06-01' };

    service.update('1', updatedProduct).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush({ success: true });
  });

  it('delete should DELETE a product by id', () => {
    service.delete('1').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('checkIdExists should GET boolean if id exists', () => {
    service.checkIdExists('1').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
