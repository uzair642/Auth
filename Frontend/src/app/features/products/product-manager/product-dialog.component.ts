import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductService, Product } from '../../../core/services/product.service';
import { AiDescriptionDialogComponent } from './ai-description-dialog.component';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
  productForm: FormGroup;
  isEdit = false;
  categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Health', 'Other'];
  @ViewChild('mainEditor') mainEditor!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isEdit = !!data;
    this.productForm = this.fb.group({
      id: [data?.id],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      regularPrice: [data?.regularPrice || 0, [Validators.required, Validators.min(0)]],
      salePrice: [data?.salePrice || 0, [Validators.required, Validators.min(0)]],
      isActive: [data ? data.isActive : true],
      category: [data?.category || ''],
      imageUrl: [data?.imageUrl || '']
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.mainEditor && this.productForm.get('description')?.value) {
      this.mainEditor.nativeElement.innerHTML = this.productForm.get('description')?.value;
    }
  }

  onDescriptionChange(event: Event) {
    const html = (event.target as HTMLElement).innerHTML;
    this.productForm.patchValue({ description: html });
    this.productForm.get('description')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  openAiGenerator() {
    const name = this.productForm.get('name')?.value;
    const category = this.productForm.get('category')?.value;
    const currentDescription = this.productForm.get('description')?.value;

    if (!name || !category) {
      this.snackBar.open('Please provide a Name and Category first.', 'Close', { duration: 3000 });
      return;
    }

    const aiDialogRef = this.dialog.open(AiDescriptionDialogComponent, {
      width: '500px',
      data: { productName: name, productCategory: category, currentDescription: currentDescription }
    });

    aiDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productForm.patchValue({ description: result });
        if (this.mainEditor) {
          this.mainEditor.nativeElement.innerHTML = result;
        }
      }
    });
  }
}
