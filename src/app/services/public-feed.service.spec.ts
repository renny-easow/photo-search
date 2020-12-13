import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { FeedItem } from '../typings/feed-item';
import { PublicFeedService } from './public-feed.service';

const rawData = {
    title: 'Recent Uploads tagged food',
    link: 'https://www.flickr.com/photos/tags/food/',
    description: '',
    modified: '2018-11-12T23:15:25Z',
    generator: 'https://www.flickr.com',
    items: [
        {
            media: { m: 'thumb1.jpg' },
            author: 'Author1',
            date_taken: '2018-11-12T23:15:25Z',
            tags: 'food culture music',
            link: 'image1.link'
        },
        {
            media: { m: 'thumb2.jpg' },
            author: 'Author2',
            date_taken: '2018-11-12T23:15:25Z',
            tags: 'food culture music',
            link: 'image2.link'
        },
        {
            media: { m: 'thumb3.jpg' },
            author: 'Author3',
            date_taken: '2018-11-12T23:15:25Z',
            tags: 'food culture music',
            link: 'image3.link'
        },
        {
            media: { m: 'thumb4.jpg' },
            author: 'Author4',
            date_taken: '2018-11-12T23:15:25Z',
            tags: 'food culture music',
            link: 'image4.link'
        }
    ]
};

const transformedData: FeedItem[] = [
    {
        thumbnailUrl: 'thumb1.jpg',
        author: 'Author1',
        date: new Date('2018-11-12T23:15:25Z'),
        tags: 'food culture music',
        link: 'image1.link'
    },
    {
        thumbnailUrl: 'thumb2.jpg',
        author: 'Author2',
        date: new Date('2018-11-12T23:15:25Z'),
        tags: 'food culture music',
        link: 'image2.link'
    },
    {
        thumbnailUrl: 'thumb3.jpg',
        author: 'Author3',
        date: new Date('2018-11-12T23:15:25Z'),
        tags: 'food culture music',
        link: 'image3.link'
    },
    {
        thumbnailUrl: 'thumb4.jpg',
        author: 'Author4',
        date: new Date('2018-11-12T23:15:25Z'),
        tags: 'food culture music',
        link: 'image4.link'
    }
];

class HttpClientMock {
    get(url: string): Observable<any> {
        return of(rawData);
    }
}

describe('PublicFeedService', () => {
    let service: PublicFeedService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: HttpClient, useClass: HttpClientMock }
            ]
        });
        service = TestBed.inject(PublicFeedService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call api with correct url', () => {
        const httpClient = TestBed.get(HttpClient) as HttpClient;
        spyOn(httpClient, 'get').and.callThrough();

        service.getImages('food');
        const url = 'https://cors-anywhere.herokuapp.com/https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=food';
        expect(httpClient.get).toHaveBeenCalledWith(url);
    });

    it('should return feed correctly', () => {
        const httpClient = TestBed.get(HttpClient) as HttpClient;
        spyOn(httpClient, 'get').and.callThrough();

        service.getImages().subscribe(response => {
            expect(response).toEqual(transformedData);
        });
    });

    it('should throw error if api fails', () => {
        const httpClient = TestBed.get(HttpClient) as HttpClient;
        spyOn(httpClient, 'get').and.callFake(() => {
            return throwError(new HttpErrorResponse({ error: { code: 'generic_error' } }));
        });

        service.getImages().subscribe(
            response => {
                expect(response).toBeUndefined();
            },
            (error: HttpErrorResponse) => {
                expect(error).toBeDefined();
                expect(error.error.code).toEqual('generic_error');
            });
    });
});
