import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog/blog.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userBlogs: Blog[] = [];

  constructor(
    private _blogService: BlogService,
    private _router: Router,
    private _toastr: ToastrService,
    private _accountService: AccountService
  ) {}

  ngOnInit(): void {
    const applicationUserId =
      this._accountService.currentUserValue?.applicationUserId ?? -1;

    this._blogService.getByApplicationUserId(applicationUserId).subscribe(
      (userBlogs) => (this.userBlogs = userBlogs),
      (error) => console.log('blogs.getByApplicationUser API', { error })
    );
  }

  confirmDelete(blog: Blog, del: boolean = false): void {
    blog.deleteConfirm = del;
  }

  deleteConfirmed(blog: Blog, blogs: Blog[]): void {
    this._blogService.delete(blog.blogId).subscribe(
      () => {
        const index = blogs.findIndex((r) => r.blogId === blog.blogId);
        if (index > -1) {
          blogs.splice(index, 1);
        }

        this._toastr.info('Blog deleted.');
      },
      (error) => console.log('blog delete API', { error })
    );
  }

  editBlog(blogId: number): void {
    this._router.navigate([`/dashboard/${blogId}`]);
  }

  createBlog(): void {
    this._router.navigate(['/dashboard/-1']);
  }
}
