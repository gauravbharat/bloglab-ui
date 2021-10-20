import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/models/photo/photo.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.css'],
})
export class PhotoAlbumComponent implements OnInit {
  @ViewChild('photoForm') photoForm!: NgForm;
  @ViewChild('photoUploadElement') photoUploadEl!: ElementRef;

  photos: Photo[] = [];
  photoFile: any;
  newPhotoDescription: string = '';

  constructor(
    private _photoService: PhotoService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._photoService.getByApplicationUserId().subscribe(
      (userPhotos) => (this.photos = userPhotos),
      (err) => console.log('_photoService.getByApplicationUser API', { err })
    );
  }

  confirmDelete(photo: Photo, del: boolean = false): void {
    photo.deleteConfirm = del;
  }

  deleteConfirmed(photo: Photo, photos: Photo[]): void {
    this._photoService.delete(photo.photoId).subscribe(
      () => {
        const index = photos.findIndex((r) => r.photoId === photo.photoId);
        if (index > -1) {
          photos.splice(index, 1);
        }

        this._toastr.info('Photo deleted.');
      },
      (error) => console.log('photo delete API', { error })
    );
  }

  onFileChange(e: any): void {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      this.photoFile = file;
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('file', this.photoFile, this.newPhotoDescription);

    this._photoService.create(formData).subscribe(
      (createdPhoto) => {
        this.photoForm.reset();
        this.photoUploadEl.nativeElement.value = '';

        this._toastr.success('Photo uploaded');
        this.photos.unshift(createdPhoto);
      },
      (err) => console.log('_photoService.create API', { formData, err })
    );
  }
}
