import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Image } from 'angular2_photoswipe';
declare const require: any;
@Component({
  selector: 'app-gallery-grid-desc',
  templateUrl: './gallery-grid-desc.component.html',
  styleUrls: ['./gallery-grid-desc.component.css']
})
export class GalleryGridDescComponent implements OnInit {
  image1: Image;
  image2: Image;
  image3: Image;
  image4: Image;
  image5: Image;
  image6: Image;
  image7: Image;
  image8: Image;
  image9: Image;
  image10: Image;
  image11: Image;
  image12: Image;
  options = {
    close: true,
    expand: false,
    minimize: false,
    reload: true
  };
  imageOptions = {
    close: true,
    expand: true,
    minimize: true,
    reload: true
  };
  public breadcrumb: any;

  @BlockUI('imageGallery') blockUIImageGallery: NgBlockUI;

  constructor() { }

  ngOnInit() {
    this.image1 = new Image();
    this.image1.largeUrl = '../../../../../assets/images/gallery/1.jpg';
    this.image1.height = 496;
    this.image1.width = 334;
    this.image1.id = 0;
    this.image1.size = `${this.image1.width}x${this.image1.height}`;
    this.image1.thumbUrl = '../../../../../assets/images/gallery/1.jpg';
    this.image1.description = 'hello world';
    this.image1.author = 'David Wollschlegel';
    this.image2 = new Image();
    this.image2.largeUrl = '../../../../../assets/images/gallery/2.jpg';
    this.image2.height = 4296;
    this.image2.width = 4934;
    this.image2.id = 1;
    this.image2.size = `${this.image2.width}x${this.image2.height}`;
    this.image2.thumbUrl = '../../../../../assets/images/gallery/2.jpg';
    this.image2.description = 'hello world';
    this.image2.author = 'David Wollschlegel';
      this.image3 = new Image();
    this.image3.largeUrl = '../../../../../assets/images/gallery/3.jpg';
    this.image3.height = 4296;
    this.image3.width = 4934;
    this.image3.id = 2;
    this.image3.size = `${this.image3.width}x${this.image3.height}`;
    this.image3.thumbUrl = '../../../../../assets/images/gallery/3.jpg';
    this.image3.description = 'hello world';
    this.image3.author = 'David Wollschlegel';
    this.image4 = new Image();
    this.image4.largeUrl = '../../../../../assets/images/gallery/4.jpg';
    this.image4.height = 4296;
    this.image4.width = 4934;
    this.image4.id = 3;
     this.image4.size = `${this.image4.width}x${this.image4.height}`;
    this.image4.thumbUrl = '../../../../../assets/images/gallery/4.jpg';
    this.image4.description = 'hello world';
    this.image4.author = 'David Wollschlegel';
    this.image5 = new Image();
    this.image5.largeUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image5.height = 4296;
    this.image5.width = 4934;
    this.image5.id = 4;
     this.image5.size = `${this.image5.width}x${this.image5.height}`;
    this.image5.thumbUrl = '../../../../../assets/images/gallery/5.jpg';
    this.image6 = new Image();
    this.image6.largeUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image6.height = 4296;
    this.image6.width = 4934;
    this.image6.id = 5;
    this.image6.size = `${this.image6.width}x${this.image6.height}`;
    this.image6.thumbUrl = '../../../../../assets/images/gallery/6.jpg';
    this.image7 = new Image();
    this.image7.largeUrl = '../../../../../assets/images/gallery/7.jpg';
    this.image7.height = 4296;
    this.image7.width = 4934;
    this.image7.id = 6;
     this.image7.size = `${this.image7.width}x${this.image7.height}`;
    this.image7.thumbUrl = '../../../../../assets/images/gallery/7.jpg';
    this.image8 = new Image();
    this.image8.largeUrl = '../../../../../assets/images/gallery/8.jpg';
    this.image8.height = 4296;
    this.image8.width = 4934;
    this.image8.id = 7;
     this.image8.size = `${this.image4.width}x${this.image4.height}`;
    this.image8.thumbUrl = '../../../../../assets/images/gallery/8.jpg';
    this.image9 = new Image();
    this.image9.largeUrl = '../../../../../assets/images/gallery/9.jpg';
    this.image9.height = 4296;
    this.image9.width = 4934;
    this.image9.id = 8;
     this.image9.size = `${this.image4.width}x${this.image4.height}`;
    this.image9.thumbUrl = '../../../../../assets/images/gallery/9.jpg';
    this.image10 = new Image();
    this.image10.largeUrl = '../../../../../assets/images/gallery/10.jpg';
    this.image10.height = 4296;
    this.image10.width = 4934;
    this.image10.id = 9;
     this.image10.size = `${this.image10.width}x${this.image10.height}`;
    this.image10.thumbUrl = '../../../../../assets/images/gallery/10.jpg';
    this.image11 = new Image();
    this.image11.largeUrl = '../../../../../assets/images/gallery/11.jpg';
    this.image11.height = 4296;
    this.image11.width = 4934;
    this.image11.id = 10;
     this.image11.size = `${this.image11.width}x${this.image11.height}`;
    this.image11.thumbUrl = '../../../../../assets/images/gallery/11.jpg';
    this.image12 = new Image();
    this.image12.largeUrl = '../../../../../assets/images/gallery/12.jpg';
    this.image12.height = 4296;
    this.image12.width = 4934;
    this.image12.id = 11;
     this.image12.size = `${this.image12.width}x${this.image12.height}`;
    this.image12.thumbUrl = '../../../../../assets/images/gallery/12.jpg';
    this.breadcrumb = {
      'mainlabel': 'Gallery Media Grid With Description',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/sales'
        },
        {
          'name': 'Gallery',
          'isLink': true,
          'link': ''
        },
        {
          'name': 'Gallery Media Grid With Description',
          'isLink': false
        }
      ]
    };
  }

  reloadImageGallery() {
    this.blockUIImageGallery.start('Loading..');

    setTimeout(() => {
      this.blockUIImageGallery.stop();
    }, 2500);
  }
}
