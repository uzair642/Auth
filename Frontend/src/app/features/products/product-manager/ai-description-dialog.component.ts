import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-ai-description-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>AI Description Generator</h2>
    <mat-dialog-content>
      <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Language</mat-label>
          <mat-select [(ngModel)]="selectedLanguage">
            <mat-option *ngFor="let lang of languages" [value]="lang">{{lang}}</mat-option>
          </mat-select>
        </mat-form-field>
        
        <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; color: #666; font-weight: 500;">Generated Description</label>
          <div #editor 
               class="rich-text-editor" 
               contenteditable="true" 
               [innerHTML]="generatedDescription"
               placeholder="Generated text will appear here...">
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-stroked-button color="accent" (click)="generate()" [disabled]="isGenerating">
        {{ isGenerating ? 'Generating...' : (generatedDescription ? 'Regenerate' : 'Generate') }}
      </button>
      <button mat-flat-button class="primary-button" color="primary" (click)="accept()" [disabled]="!generatedDescription || isGenerating">Accept</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { min-width: 450px; }
    .rich-text-editor {
      min-height: 200px;
      max-height: 350px;
      overflow-y: auto;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 12px;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.5;
      background: #fafafa;
    }
    .rich-text-editor:focus {
      outline: 2px solid #4f46e5;
      border-color: transparent;
      background: #ffffff;
    }
  `]
})
export class AiDescriptionDialogComponent {
  @ViewChild('editor') editor!: ElementRef;

  selectedLanguage = 'English';
  languages = ['English', 'Urdu', 'Mixed'];
  generatedDescription = '';
  isGenerating = false;

  constructor(
    public dialogRef: MatDialogRef<AiDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productName: string, productCategory: string, currentDescription?: string },
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    if (data.currentDescription) {
      this.generatedDescription = data.currentDescription;
    }
  }

  generate() {
    this.isGenerating = true;
    this.cdr.detectChanges();
    
    const payload = {
      productName: this.data.productName,
      productCategory: this.data.productCategory,
      language: this.selectedLanguage
    };

    this.productService.generateDescription(payload).subscribe({
      next: (res) => {
        this.isGenerating = false;
        if (res.success && res.description) {
          this.generatedDescription = this.markdownToHtml(res.description);
          this.snackBar.open('Description generated successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(res.errorMessage || 'Failed to generate description.', 'Close', { duration: 3000 });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isGenerating = false;
        this.snackBar.open('Error generating description.', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  markdownToHtml(md: string): string {
    if (!md) return '';
    let html = md;
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^[\*-] (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>(\n<li>.*<\/li>)*)/g, '<ul>$1</ul>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/<\/ul><br>/g, '</ul>');
    html = html.replace(/<ul><br>/g, '<ul>');
    html = html.replace(/<\/li><br>/g, '</li>');
    
    return html;
  }

  accept() {
    if (this.editor) {
      this.generatedDescription = this.editor.nativeElement.innerHTML;
    }
    this.dialogRef.close(this.generatedDescription);
  }

  close() {
    this.dialogRef.close();
  }
}
