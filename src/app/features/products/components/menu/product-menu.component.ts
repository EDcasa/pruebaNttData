// src/app/features/products/components/product-menu.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-menu.component.html',
  styleUrls: ['./product-menu.component.scss']
})
export class ProductMenuComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  menuOpen = false;
  showModal = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onEdit() {
    this.edit.emit();
    this.menuOpen = false;
  }

  confirmDelete() {
    this.showModal = true;
    this.menuOpen = false;
  }

  onDelete() {
    this.delete.emit();
    this.showModal = false;
  }
}
