import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductMenuComponent } from '../menu/product-menu.component';
import { ConfirmationModalComponent } from '../../../../shared/components/modal/confirmation-modal.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,ProductMenuComponent, ConfirmationModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() deleted = new EventEmitter<void>();

  menuOpen = false;
  showModal = false;

  constructor(private router: Router, private productService: ProductService) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  edit() {
    this.router.navigate(['/edit', this.product.id]);
  }

  confirmDelete() {
    this.showModal = true;
    this.menuOpen = false;
  }

  deleteProduct() {
    this.productService.delete(this.product.id).subscribe(() => {
      this.deleted.emit();
      this.showModal = false;
    });
  }
}
