import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BlogPaging } from 'src/app/models/blog/blog-paging.model';
import { Blog } from 'src/app/models/blog/blog.model';
import { PagedResult } from 'src/app/models/blog/paged-result.model';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  pagedBlogResult!: PagedResult<Blog>;

  constructor(private _blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPagedBlogResult(1, 6);
  }

  pageChanged(e: PageChangedEvent): void {
    this.loadPagedBlogResult(e.page, e.itemsPerPage);
  }

  loadPagedBlogResult(page: number, itemsPerPage: number): void {
    const blogPaging = new BlogPaging(page, itemsPerPage);

    this._blogService.getAll(blogPaging).subscribe(
      (pagedBlogs) => (this.pagedBlogResult = pagedBlogs),
      (err) =>
        console.log('_blogService.getAll API', { page, itemsPerPage, err })
    );
  }
}
