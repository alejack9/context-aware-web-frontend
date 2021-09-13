import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.changeMapHeight(window.innerHeight);
  }
  mapHeight: number;
  @ViewChild('checkboxContainer') checkBoxContainerElement: ElementRef;

  @HostListener('window:resize', ['$event']) sizeChange(event: any) {
    this.changeMapHeight(event.target.innerHeight);
  }
  title = 'context-aware-web-frontend';

  changeMapHeight(windowHeight: number) {
    this.mapHeight =
      windowHeight - this.checkBoxContainerElement.nativeElement.offsetHeight;
  }
}
