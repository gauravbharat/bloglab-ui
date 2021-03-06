import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from 'src/app/models/blog/blog.model';
import { PhotoService } from 'src/app/services/photo.service';

import * as CKEditor from '../../../../ckeditor';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent implements OnInit {
  @Input() blog!: Blog;

  blogPhotoUrl!: string;

  public ckEditor = CKEditor;
  public editorConfig = {
    toolbar: [],
  };

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    // console.log({ editor });
  }

  constructor(private _router: Router, private _photoService: PhotoService) {}

  ngOnInit(): void {
    if (!!this.blog?.photoId) {
      this._photoService.get(this.blog.photoId).subscribe(
        (photo) => {
          if (!!photo) this.blogPhotoUrl = photo.imageUrl;
        },
        (err) =>
          console.log('BlogCardComponent _photoService.get API', {
            blog: this.blog,
            err,
          })
      );
    }
  }

  readMore(blogId: number): void {
    this._router.navigate([`/blogs/${this.blog.blogId}`]);
  }
}
