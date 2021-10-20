import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { BlogCreate } from 'src/app/models/blog/blog-create.model';
import { Blog } from 'src/app/models/blog/blog.model';
import { Photo } from 'src/app/models/photo/photo.model';
import { BlogService } from 'src/app/services/blog.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
})
export class BlogEditComponent implements OnInit {
  blogForm!: FormGroup;
  confirmPhotoDelete: boolean = false;
  userPhotos: Photo[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _blogService: BlogService,
    private _photoService: PhotoService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const blogId: number = parseInt(
      this._route?.snapshot?.paramMap?.get('id') ?? '-1'
    );

    this.blogForm = this._fb.group({
      blogId: [blogId],
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(300),
          Validators.maxLength(5000),
        ],
      ],
      photoDescription: [null],
      photoId: [null],
    });

    this._photoService.getByApplicationUserId().subscribe(
      (userPhotos) => (this.userPhotos = userPhotos),
      (err) => console.log('_photoService.getByApplicationUser API', { err })
    );

    if (!!blogId && blogId !== -1) {
      this._blogService.get(blogId).subscribe(
        (blog) => this.updateForm(blog),
        (err) => console.log('get blog API', { blogId, err })
      );
    }
  }

  getPhoto(photoId: number | undefined): Photo | null {
    return this.userPhotos.find((r) => r.photoId === photoId) ?? null;
  }

  isTouched(field: string): boolean {
    return this.blogForm.get(field)?.touched ?? false;
  }

  hasErrors(field: string): ValidationErrors | null | undefined {
    return this.blogForm.get(field)?.errors;
  }

  hasError(field: string, error: string): boolean {
    return this.blogForm.get(field)?.hasError(error) ?? false;
  }

  isNew() {
    return parseInt(this.blogForm.get('blogId')?.value) === -1;
  }

  detachPhoto(): void {
    this.blogForm.patchValue({
      photoId: null,
      photoDescription: null,
    });
  }

  updateForm(blog: Blog): void {
    const photoDescription = this.getPhoto(blog?.photoId)?.description;

    this.blogForm.patchValue({
      blogId: blog.blogId,
      title: blog.title,
      content: blog.content,
      photoId: blog.photoId,
      photoDescription,
    });
  }

  onSelect(e: TypeaheadMatch): void {
    const chosenPhoto: Photo = e.item;

    this.blogForm.patchValue({
      photoId: chosenPhoto.photoId,
      photoDescription: chosenPhoto.description,
    });
  }

  onSubmit(): void {
    const blogCreate: BlogCreate = new BlogCreate(
      this.blogForm.get('blogId')?.value,
      this.blogForm.get('title')?.value,
      this.blogForm.get('content')?.value,
      this.blogForm.get('photoId')?.value
    );

    this._blogService.create(blogCreate).subscribe(
      (createdBlog) => {
        this._toastr.success(`Blog ${this.isNew() ? 'created' : 'updated'}!`);
        this.updateForm(createdBlog);
      },
      (err) => console.log('onSubmit blogCreate API', { blogCreate, err })
    );
  }
}
