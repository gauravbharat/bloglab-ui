import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/models/blog/blog.model';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-famous-blogs',
  templateUrl: './famous-blogs.component.html',
  styleUrls: ['./famous-blogs.component.css'],
})
export class FamousBlogsComponent implements OnInit {
  famousBlogs: Blog[] = [];

  constructor(private _blogService: BlogService) {}

  ngOnInit(): void {
    this._blogService.getMostFamous().subscribe(
      (famousBlogs) => (this.famousBlogs = famousBlogs),
      (err) => console.log('_blogService.getMostFamous API', { err })
    );
  }
}
