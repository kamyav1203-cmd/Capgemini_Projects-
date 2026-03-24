import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { of, fromEvent, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rxjs-demo.html',
  styleUrls: ['./rxjs-demo.css']
})

export class RxjsDemoComponent implements OnInit, AfterViewInit {

  @ViewChild('clickBtn') clickBtn!: ElementRef;
  @ViewChild('searchBox') searchBox!: ElementRef;

  observableOutput: any[] = [];
  mapOutput: any[] = [];
  filterOutput: any[] = [];
  multiMapOutput: any[] = [];
  behaviorOutput: any[] = [];
  clickOutput: string = '';
  searchOutput: any[] = [];
  mergeMapOutput: any[] = [];

  loading = false;

  constructor(private http: HttpClient) {}

  // NON-DOM logic
  ngOnInit(): void {

    const observable$ = of(1, 2, 3, 4, 5);

    // Observable
    observable$.subscribe((val: number) => this.observableOutput.push(val));

    // Map
    observable$.pipe(
      map((x: number) => x * 10)
    ).subscribe((res: number) => this.mapOutput.push(res));

    // Filter + Map
    observable$.pipe(
      map((x: number) => x % 2 === 0 ? x * 100 : null)
    ).subscribe((res: any) => {
      if (res !== null) this.filterOutput.push(res);
    });

    // Multiple Map ✅ (FIXED LOCATION)
    observable$.pipe(
      map(x => x + 1),
      map(x => x * 2),
      map(x => `Final: ${x}`)
    ).subscribe(res => this.multiMapOutput.push(res));

    // mergeMap (parallel API calls) ✅ (FIXED LOCATION)
    of(1, 2, 3).pipe(
      mergeMap(id =>
        this.http.get<any>(`https://jsonplaceholder.typicode.com/posts/${id}`)
      )
    ).subscribe(res => {
      this.mergeMapOutput.push(res);
    });
  }

  ngAfterViewInit(): void {

    // Search with filter + debounceTime + switchMap
    fromEvent(this.searchBox.nativeElement, 'input').pipe(

      debounceTime(500),

      map((event: any) => event.target.value.trim()),

      filter(text => text.length >= 3),

      switchMap(text => {
        this.loading = true;

        return this.http.get<any[]>(
          `https://jsonplaceholder.typicode.com/posts?q=${text}`
        );
      })

    ).subscribe({
  next: (res) => {
    this.searchOutput = res;
    this.loading = false;
  },
  error: () => {
    this.searchOutput = [];
    this.loading = false;
  },
  complete: () => {
    console.log('Search completed');
  }
});
}
}