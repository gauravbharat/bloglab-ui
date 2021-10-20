import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-system',
  templateUrl: './comment-system.component.html',
  styleUrls: ['./comment-system.component.css'],
})
export class CommentSystemComponent implements OnInit {
  @Input() blogId!: number;

  constructor() {}

  ngOnInit(): void {}
}
