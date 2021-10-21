import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlogCommentViewModel } from 'src/app/models/blog-comment/blog-comment-view-model.model';
import { BlogComment } from 'src/app/models/blog-comment/blog-comment.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogCommentService } from 'src/app/services/blog-comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() comments!: BlogCommentViewModel[];
  constructor(
    public accountService: AccountService,
    private _blogCommentService: BlogCommentService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  editComment(comment: BlogCommentViewModel, choice: boolean = false): void {
    comment.isEditable = choice;
  }

  showDeleteConfirm(
    comment: BlogCommentViewModel,
    choice: boolean = false
  ): void {
    comment.deleteConfirm = choice;
  }

  deleteConfirmed(
    comment: BlogCommentViewModel,
    comments: BlogCommentViewModel[]
  ): void {
    this._blogCommentService.delete(comment.blogCommentId).subscribe(
      () => {
        const index = comments.findIndex(
          (r) => r.blogCommentId === comment.blogCommentId
        );
        if (index > -1) {
          comments.splice(index, 1);
        }
        this._toastr.success('Blog comment deleted.');
      },
      (err) =>
        console.log('_blogCommentService.delete API', {
          comment,
          comments,
          err,
        })
    );
  }

  replyComment(comment: BlogCommentViewModel): void {
    let replyComment: BlogCommentViewModel = {
      parentBlogCommentId: comment.blogCommentId,
      content: '',
      blogId: comment.blogId,
      blogCommentId: -1,
      username: this.accountService.currentUserValue?.username ?? '',
      publishDate: new Date(),
      updateDate: new Date(),
      isEditable: false,
      deleteConfirm: false,
      isReplying: true,
      comments: [],
    };

    comment.comments.push(replyComment);
  }

  onCommentSave(blogComment: BlogComment, comment: BlogCommentViewModel): void {
    comment.blogCommentId = blogComment.blogCommentId;
    comment.parentBlogCommentId = blogComment?.parentBlogCommentId ?? null;
    comment.blogId = blogComment.blogId;
    comment.content = blogComment.content;
    comment.publishDate = blogComment.publishDate;
    comment.updateDate = blogComment.updateDate;
    comment.username = blogComment.username;
    comment.isEditable = false;
    comment.isReplying = false;
  }
}
