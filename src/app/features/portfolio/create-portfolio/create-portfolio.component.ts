import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TemplateService } from '../../../core/services/template.service';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-create-portfolio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-portfolio.component.html'
})
export class CreatePortfolioComponent implements OnInit {
  // Services
  templateService = inject(TemplateService);
  portfolioService = inject(PortfolioService);
  router = inject(Router);
  fb = inject(FormBuilder);

  // Data
  templates: any[] = [];
  selectedTemplate: any = null;
  isLoading = true;
  isSubmitting = false;

  // Form for the final step (Slug)
  portfolioForm: FormGroup;

  constructor() {
    this.portfolioForm = this.fb.group({
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]]
    });
  }

  ngOnInit() {
    // Fetch all templates on load
    this.templateService.getTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load templates', err);
        this.isLoading = false;
      }
    });
  }

  selectTemplate(template: any) {
    this.selectedTemplate = template;
    // Scroll to bottom or next step logic could go here
  }

  createPortfolio() {
    if (this.portfolioForm.invalid || !this.selectedTemplate) return;

    this.isSubmitting = true;
    const slug = this.portfolioForm.get('slug')?.value;

    const payload = {
      template_id: this.selectedTemplate.id,
      slug: slug,
      // We start with the template's default structure
      content: this.selectedTemplate.default_structure 
    };

    this.portfolioService.createPortfolio(payload).subscribe({
      next: (res) => {
        // Success! Redirect to the Editor
        this.router.navigate(['/editor', res.id]);
      },
      error: (err) => {
        alert('Error: ' + (err.error.detail || 'Could not create portfolio. Slug might be taken.'));
        this.isSubmitting = false;
      }
    });
  }
}