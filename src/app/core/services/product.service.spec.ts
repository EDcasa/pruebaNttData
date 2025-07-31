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

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET list of products', () => {
    const dummyProducts: Product[] =  [
        {
            "id": "PROD1",
            "name": "TOMATES",
            "description": "TOMATES DEL CAMPO A LA BOCA",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg",
            "date_release": "2025-07-31",
            "date_revision": "2026-07-31"
        }
    ];

    service.getAll().subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProducts });
  });

  it('getById should GET a single product by id', () => {
    const dummyProduct: Product = {
            "id": "PROD1",
            "name": "TOMATES",
            "description": "TOMATES DEL CAMPO A LA BOCA",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg",
            "date_release": "2025-07-31",
            "date_revision": "2026-07-31"
        };

    service.getById('PROD1').subscribe(res => {
      expect(res.data).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/PROD1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProduct });
  });

  it('create should POST a new product', () => {
    const newProduct: Product = {
      id: 'prodaaaa3',
      name: 'Prod 3',
      description: 'Desc 3',
      logo: 'logo3.png',
      date_release: '2022-05-01',
      date_revision: '2022-06-01'
    };

    service.create(newProduct).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ success: true });
  });

  it('update should PUT updated product data', () => {
    const updatedProduct = {
      name: 'Prod Updated',
      description: 'Desc Updated',
      logo: 'logo-updated.png',
      date_release: '2022-05-01',
      date_revision: '2022-06-01'
    };

    service.update('PROD1', updatedProduct).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/PROD1`);
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
