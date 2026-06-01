import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Product } from '../../../core/services/product.service';

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
    MatCheckboxModule
  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
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

  onSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}
