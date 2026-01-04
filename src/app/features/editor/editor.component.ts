import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { DevMinimalistComponent } from './templates/dev-minimalist/dev-minimalist.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DevMinimalistComponent],
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  route = inject(ActivatedRoute);
  portfolioService = inject(PortfolioService);
  fb = inject(FormBuilder);

  portfolioId!: number;
  portfolio: any = null;
  form!: FormGroup;
  
  // State
  isLoading = true;
  isSaving = false;
  activeTab = 'editor'; // 'editor' or 'preview' (for mobile)
  
  // Helps us know which component to render
  templateCode = ''; 

  ngOnInit() {
    this.portfolioId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPortfolio();
  }

  loadPortfolio() {
    this.portfolioService.getMyPortfolios().subscribe(list => {
      // Find the specific portfolio from the list (or fetch detail endpoint)
      // Since we implemented getPortfolioDetail in backend, let's use that if available,
      // but assuming we use the list endpoint or specific detail:
      // Let's assume we call the detail endpoint:
      // Note: If you haven't added getPortfolioById to the service, do that. 
      // For now, I'll assume we find it in the list or fetch it.
      
      // Let's implement a quick fetch detail in the service or just find it here:
      const p = list.find(x => x.id === this.portfolioId);
      
      if (p) {
        this.portfolio = p;
        // In a real app, we'd fetch the Template info to know 'code' (dev_v1)
        // For this demo, we assume ID 1 is the dev template
        this.templateCode = 'dev_v1'; 
        
        this.initForm(p.content);
        this.isLoading = false;
      }
    });
  }

  // --- THE MAGIC: RECURSIVE FORM BUILDER ---
  initForm(data: any) {
    this.form = this.fb.group({});
    
    // We iterate over keys (hero, about, projects...)
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        this.form.addControl(key, this.fb.array(value.map(item => this.createFormGroupOrControl(item))));
      } else if (typeof value === 'object' && value !== null) {
        this.form.addControl(key, this.createFormGroup(value));
      } else {
        this.form.addControl(key, this.fb.control(value));
      }
    });

    // Auto-save listener
    this.form.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
      this.savePortfolio(val);
    });
  }

  createFormGroup(data: any): FormGroup {
    const group = this.fb.group({});
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (Array.isArray(value)) {
         group.addControl(key, this.fb.array(value.map(i => this.createFormGroupOrControl(i))));
      } else if (typeof value === 'object' && value !== null) {
        group.addControl(key, this.createFormGroup(value));
      } else {
        group.addControl(key, this.fb.control(value));
      }
    });
    return group;
  }

  createFormGroupOrControl(item: any): any {
    if (typeof item === 'object' && item !== null) {
      return this.createFormGroup(item);
    }
    return this.fb.control(item);
  }

  // --- UI HELPERS ---
  
  // Get keys of a FormGroup to loop in HTML
  getKeys(group: any): string[] {
    return Object.keys(group.controls);
  }

  // Check types for HTML switch cases
  isGroup(control: any): boolean { return control instanceof FormGroup; }
  isArray(control: any): boolean { return control instanceof FormArray; }
  isControl(control: any): boolean { return control instanceof FormControl; }
  
  // Cast helper for HTML
  getAsGroup(control: any): FormGroup { return control as FormGroup; }
  getAsArray(control: any): FormArray { return control as FormArray; }

  savePortfolio(data: any) {
    this.isSaving = true;
    this.portfolioService.updatePortfolio(this.portfolioId, { // We actually need an UPDATE method
       // Wait, we need to update the EXISTING portfolio, not create new.
       // We need to update the service to support PUT /api/portfolios/:id
       // For now, let's assume we implement update logic.       
       content: data
    }).subscribe({
        next: () => { 
           this.isSaving = false;
           // Update local object for preview
           this.portfolio.content = data;
        }, 
        error: () => this.isSaving = false
    });
  }

  togglePublish() {
    const newStatus = !this.portfolio.is_published;
    
    this.portfolioService.updatePortfolio(this.portfolioId, { 
      is_published: newStatus 
    }).subscribe({
      next: () => {
        this.portfolio.is_published = newStatus;
        // Optional: Show toast message
      }
    });
  }
  
  viewLive() {
    // Open in new tab
    window.open(`/p/${this.portfolio.slug}`, '_blank');
  }
  
}