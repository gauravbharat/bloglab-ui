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

import * as CKEditor from '../../../../ckeditor';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
})
export class BlogEditComponent implements OnInit {
  blogForm!: FormGroup;
  confirmPhotoDelete: boolean = false;
  userPhotos: Photo[] = [];
  charactersLength: any;
  currentUser: any;
  ckEditor = CKEditor;
  editorConfig = {};

  public onReady(editor: any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );

    // console.log({ editor });
  }

  constructor(
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _blogService: BlogService,
    private _photoService: PhotoService,
    private _toastr: ToastrService,
    private _accountService: AccountService
  ) {
    this.currentUser = this._accountService.currentUserValue;

    this.editorConfig = {
      toolbar: [
        'exportPdf',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'highlight',
        '|',
        'alignment',
        'indent',
        'outdent',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'horizontalLine',
        'link',
        'blockQuote',
        'insertImage',
        'insertTable',
        'mediaEmbed',
        'todoList',
        '|',
        'undo',
        'redo',
      ],
      image: {
        toolbar: [
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          '|',
          'toggleImageCaption',
          'imageTextAlternative',
        ],
        // styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
        // resizeOptions: [
        //   {
        //     name: 'imageResize:original',
        //     label: 'Original',
        //     value: null,
        //   },
        //   {
        //     name: 'imageResize:50',
        //     label: '50%',
        //     value: '50',
        //   },
        //   {
        //     name: 'imageResize:75',
        //     label: '75%',
        //     value: '75',
        //   },
        // ],
      },
      language: 'en',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      licenseKey: '',
      wordCount: {
        onUpdate: (stats: any) => {
          this.charactersLength = stats.characters;
          console.log(`Characters: ${stats.characters}\nWords: ${stats.words}`);
        },
      },
      shouldNotGroupWhenFull: true,
      // simpleUpload: {
      //   uploadUrl: `${environment.webApi}/Photo`,
      //   withCredentials: true,
      //   headers: {
      //     Authorization: `Bearer ${
      //       this.currentUser ? this.currentUser?.token : ''
      //     }`,
      //   },
      // },
    };
  }

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
