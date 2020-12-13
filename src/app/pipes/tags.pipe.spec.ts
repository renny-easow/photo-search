import { TagsPipe } from './tags.pipe';

describe('TagsPipe', () => {
    let tagsPipe: TagsPipe;
    beforeEach(() => {
        tagsPipe = new TagsPipe();
    });

    it('create an instance', () => {
        expect(tagsPipe).toBeTruthy();
    });

    it('should insert comma in front of every space in the input', () => {
        expect(tagsPipe.transform('food culture music')).toEqual('food, culture, music');
    });
});
