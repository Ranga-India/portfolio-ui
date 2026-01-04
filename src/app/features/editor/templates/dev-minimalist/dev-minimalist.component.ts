import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-minimalist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-full bg-white font-sans text-gray-800">
            <header class="bg-gray-900 text-white py-20 px-6">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl font-bold mb-4">{{ data.hero?.title  || 'Your Name' }}</h1>
          <p class="text-xl text-gray-400 mb-8">{{ data.hero?.subtitle || 'Your Role' }}</p>
          <div class="flex gap-4">
             <a *ngIf="data.social_links?.github" [href]="data.social_links.github" target="_blank" class="bg-white text-gray-900 px-4 py-2 rounded font-bold hover:bg-gray-200">GitHub</a>
             <a *ngIf="data.social_links?.linkedin" [href]="data.social_links.linkedin" target="_blank" class="border border-white px-4 py-2 rounded font-bold hover:bg-white hover:text-gray-900 transition">LinkedIn</a>
          </div>
        </div>
      </header>

      <section class="py-16 px-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold border-b pb-2 mb-6">About</h2>
        <p class="text-lg leading-relaxed text-gray-600">
          {{ data.about || 'Add your bio here...' }}
        </p>
      </section>

      <section class="bg-gray-50 py-16 px-6">
        <div class="max-w-4xl mx-auto">
           <h2 class="text-2xl font-bold border-b pb-2 mb-6">Skills</h2>
           <div class="flex flex-wrap gap-3">
             <span *ngFor="let skill of data.skills" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
               {{ skill }}
             </span>
           </div>
        </div>
      </section>

      <section class="py-16 px-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold border-b pb-2 mb-6">Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div *ngFor="let project of data.projects" class="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 class="font-bold text-xl mb-2">{{ project.title }}</h3>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            <a [href]="project.link" target="_blank" class="text-blue-600 font-medium hover:underline">View Project &rarr;</a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class DevMinimalistComponent {
  @Input() data: any = {};
}