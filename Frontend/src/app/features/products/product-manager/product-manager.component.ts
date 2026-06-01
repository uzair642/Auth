import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService, Product } from '../../../core/services/product.service';
import { ProductDialogComponent } from './product-dialog.component';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-manager.component.html',
  styleUrl: './product-manager.component.css'
})
export class ProductManagerComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['name', 'category', 'regularPrice', 'salePrice', 'isActive', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '400px',
      data: product || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.productService.updateProduct(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
              this.loadProducts();
            },
            error: () => this.snackBar.open('Error updating product', 'Close', { duration: 3000 })
          });
        } else {
          const payload = { ...result };
          delete payload.id;

          this.productService.addProduct(payload).subscribe({
            next: () => {
              this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
              this.loadProducts();
            },
            error: () => this.snackBar.open('Error adding product', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: () => {
          this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
