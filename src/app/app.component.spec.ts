import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { PublicFeedService } from './services/public-feed.service';
import { FeedItem } from './typings/feed-item';

const data: FeedItem[] = [
    {
        thumbnailUrl: 'thumb1.jpg',
        author: 'Author1',
        date: new Date(),
        tags: 'food culture music',
        link: 'image1.link'
    },
    {
        thumbnailUrl: 'thumb2.jpg',
        author: 'Author2',
        date: new Date(),
        tags: 'food culture music',
        link: 'image2.link'
    },
    {
        thumbnailUrl: 'thumb3.jpg',
        author: 'Author3',
        date: new Date(),
        tags: 'food culture music',
        link: 'image3.link'
    },
    {
        thumbnailUrl: 'thumb4.jpg',
        author: 'Author4',
        date: new Date(),
        tags: 'food culture music',
        link: 'image4.link'
    }
];

class PublicFeedServiceMock {
    getImages(searchTag?: string): Observable<FeedItem[]> {
        return of(data);
    }
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let publicFeedService: PublicFeedService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: PublicFeedService, useClass: PublicFeedServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        publicFeedService = TestBed.get(PublicFeedService);
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should get feed after view initialises', () => {
        spyOn(publicFeedService, 'getImages').and.callThrough();
        component.ngAfterViewInit();
        expect(publicFeedService.getImages).toHaveBeenCalled();
    });

    it('should call getPhotos method when input changes', () => {
        spyOn<any>(component, 'getPhotos').and.callThrough();
        const inputElement = fixture.debugElement.nativeElement.querySelector('.header__search-input');
        inputElement.dispatchEvent(new Event('keyup', {}));
        fixture.detectChanges();
        delay(500);
        // tslint:disable-next-line:no-string-literal
        expect(component['getPhotos']).toHaveBeenCalledWith();
    });

    it('should set the feed to model correctly if service returns valid data', () => {
        spyOn(publicFeedService, 'getImages').and.callThrough();
        // tslint:disable-next-line:no-string-literal
        component['getPhotos']();
        expect(publicFeedService.getImages).toHaveBeenCalled();
        expect(component.feed).toEqual(data);
        expect(component.showError).toEqual(false);
    });

    it('should reset model to empty array if service throws error', () => {
        spyOn(publicFeedService, 'getImages').and.callFake(() => {
            return throwError(new HttpErrorResponse({ error: { code: 'generic_error' } }));
        });
        // tslint:disable-next-line:no-string-literal
        component['getPhotos']();
        expect(publicFeedService.getImages).toHaveBeenCalled();
        expect(component.feed).toEqual([]);
        expect(component.showError).toEqual(true);
    });
});
