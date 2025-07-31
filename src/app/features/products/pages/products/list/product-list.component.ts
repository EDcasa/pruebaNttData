import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../../components/card/product-card.component';
import { Product } from '../../../../../core/models/product.model';
import { ConfirmationModalComponent } from '../../../../../shared/components/modal/confirmation-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  
  showModal = false;
  productSelected!: Product;

  private productService = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  pageSize = signal(5);
  menuOpenIndex = signal<number | null>(null);
  currentPage = signal(1);

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: res => {
        this.products.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize());
  });
  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  goToAdd() {
    this.router.navigateByUrl('/new');
  }

   goToEdit(id: string) {
    this.router.navigate(['/edit', id]);
  }

  delete(id: string) {
    this.showModal = true;
    this.productSelected = this.products().find(p => p.id === id) as Product;
  }

  deleteProduct() {
    this.productService.delete(this.productSelected.id).subscribe(() => {
      this.loadProducts();
      this.showModal = false;
    });
  }

  toggleMenu(index: number) {
    this.menuOpenIndex.set(
      this.menuOpenIndex() === index ? null : index
    );
  }
  

  changePageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
}
