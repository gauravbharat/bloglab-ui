import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blog!: Blog;
  blogPhotoUrl!: string;

  constructor(
    private _route: ActivatedRoute,
    private _blogService: BlogService,
    private _photoService: PhotoService,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    const blogId: number = parseInt(
      this._route?.snapshot?.paramMap?.get('id') ?? '-1'
    );

    this._blogService.get(blogId).subscribe(
      (blog) => {
        // console.log({ blog, blogId });
        if (blog) {
          this.blog = blog;

          if (!!this.blog?.photoId) {
            this._photoService.get(this.blog.photoId).subscribe(
              (photo) => (this.blogPhotoUrl = photo.imageUrl),
              (err) =>
                console.log('Error getting photo from API for this blog!', {
                  blog,
                  photoId: this.blog.photoId,
                  err,
                })
            );
          }
        } else {
          this._toastr.error('Invalid or Unauthorized Blog access!');
          this._router.navigate(['/not-found']);
          return;
        }
      },
      (err) => console.log('blogService.get API', { err })
    );
  }
}
