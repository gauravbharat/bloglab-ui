import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlogCommentCreate } from 'src/app/models/blog-comment/blog-comment-create.model';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model.model';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment.model';
import { BlogCommentService } from 'src/app/services/blog-comment.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css'],
})
export class CommentBoxComponent {
  @Input() comment!: BlogCommentViewModel;
  @Output() commentSaved: EventEmitter<BlogComment> =
    new EventEmitter<BlogComment>();

  @ViewChild('commentForm') commentForm!: NgForm;

  constructor(
    private _blogCommentService: BlogCommentService,
    private _toastr: ToastrService
  ) {}

  resetComment(): void {
    this.commentForm.reset();
  }

  onSubmit(): void {
    // const blogCommentCreate: BlogCommentCreate = new BlogCommentCreate(
    //   this.comment.blogCommentId,
    //   this.comment.blogId,
    //   this.comment.content,
    //   this.comment.parentBlogCommentId
    // )

    const blogCommentCreate: BlogCommentCreate = {
      blogCommentId: this.comment.blogCommentId,
      blogId: this.comment.blogId,
      content: this.comment.content,
      parentBlogCommentId: this.comment?.parentBlogCommentId,
    };

    this._blogCommentService.create(blogCommentCreate).subscribe(
      (blogComment) => {
        this.commentSaved.emit(blogComment);
        this.resetComment();
        this._toastr.success('Comment saved.');
      },
      (err) =>
        console.log('_blogCommentService.create API', {
          blogCommentCreate,
          err,
        })
    );
  }
}
