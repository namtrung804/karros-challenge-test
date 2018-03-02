import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlogListComponent} from './blog-list/blog-list.component';
import {BlogPostComponent} from './blog-post.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BlogPostComponent, BlogListComponent]
})
export class BlogPostModule { }
