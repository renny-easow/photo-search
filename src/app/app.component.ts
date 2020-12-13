import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { PublicFeedService } from './services/public-feed.service';
import { FeedItem } from './typings/feed-item';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
    feed: FeedItem[] = [];
    showLoading = false;
    showError = false;
    private destroy$: Subject<any> = new Subject();

    constructor(private publicFeedService: PublicFeedService) { }

    ngAfterViewInit(): void {
        this.searchInput.nativeElement.focus();
        this.getPhotos();
        this.configureForChangingInput();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    private configureForChangingInput(): void {
        fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
            map((event: any) => event.target.value),
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        )
        .subscribe((searchText: string) => {
            this.getPhotos(searchText);
        });
    }

    private getPhotos(searchTags: string = ''): void {
        this.showLoading = true;
        this.publicFeedService.getImages(searchTags).subscribe(
            (feed: FeedItem[]) => {
                this.feed = feed;
            },
            (error: HttpErrorResponse) => {
                this.feed = [];
                this.showLoading = false;
                this.showError = true;
            },
            () => {
                this.showLoading = false;
                this.showError = false;
            }
        );
    }
}
