import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor() {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error.message || 'Solicitud incorrecta';
          break;
        case 404:
          errorMessage = error.error.message || 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
      }
    }

    this.showError(errorMessage);
  }

  private showError(message: string): void {
    // this.snackBar.open(message, 'Cerrar', {
    //   duration: 5000,
    //   panelClass: ['error-snackbar']
    // });
  }
}