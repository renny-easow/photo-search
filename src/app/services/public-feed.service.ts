import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { FeedItem } from '../typings/feed-item';

@Injectable({
    providedIn: 'root'
})
export class PublicFeedService {
    private corsFixUrl = 'https://cors-anywhere.herokuapp.com/';
    private feedBaseUrl = 'https://www.flickr.com/services/feeds/photos_public.gne';

    constructor(private httpClient: HttpClient) { }

    public getImages(searchTag: string = ''): Observable<FeedItem[]> {
        const url = `${this.corsFixUrl}${this.feedBaseUrl}?format=json&nojsoncallback=1&tags=${searchTag}`;

        return this.httpClient.get<any>(url).pipe(
            switchMap((feed: any) => {
                if (feed && feed.items && feed.items instanceof Array) {
                    const images: FeedItem[] = [];
                    feed.items.forEach((image: any) => {
                        images.push({
                            thumbnailUrl: image && image.media ? image.media.m : null,
                            author: image.author,
                            date: new Date(image.date_taken),
                            tags: image.tags,
                            link: image.link
                        } as FeedItem);
                    });
                    return of(images);
                }
                return throwError(new HttpErrorResponse({ error: { code: 'generic_error' } }));
            }),
            catchError((error: HttpErrorResponse) => throwError(error))
        );
    }
}
