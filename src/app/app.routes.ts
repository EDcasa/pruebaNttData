import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/products/list/product-list.component';
import { ProductFormComponent } from './features/products/pages/products/form/product-form.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'new', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent },
];
