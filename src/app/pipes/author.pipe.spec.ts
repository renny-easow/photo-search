import { AuthorPipe } from './author.pipe';

describe('AuthorPipe', () => {
    let authorPipe: AuthorPipe;
    beforeEach(() => {
        authorPipe = new AuthorPipe();
    });

    it('create an instance', () => {
        expect(authorPipe).toBeTruthy();
    });

    it('should insert comma in front of every space in the input', () => {
        expect(authorPipe.transform('nobody@flickr.com ("Author_Name")')).toEqual('Author_Name');
        expect(authorPipe.transform('nobody@flickr.com ("Renny")')).toEqual('Renny');
        expect(authorPipe.transform('flickr.com 123')).toEqual('flickr.com 123');
    });
});
