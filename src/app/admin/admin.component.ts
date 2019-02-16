import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  images = [
    { src: "assets/images/hunt.jpg", title: "Hunting Area" },
    { src: "assets/images/husky.jpg", title: "Siberian Husky" },
    { src: "assets/images/io.jpg", title: "Io" },
    { src: "assets/images/pears-soap.jpg", title: "Pears" },
    { src: "assets/images/tom-and-jerry.jpg", title: "Tom and Jerry" },
    { src: "assets/images/trees.jpg", title: "Trees" },
    { src: "assets/images/yoyos.jpg", title: "Yoyos" }
  ];

  @ViewChild("imgCarousel")
  imgCarousel: any;

  constructor() {}

  ngOnInit() {}

  prev() {
    this.imgCarousel.prev();
  }

  next() {
    this.imgCarousel.next();
  }
}
