export class Business {
    id: string = '-1';
    name: string = '';
    image_url: string = '';
    is_claimed: boolean = true;
    is_closed: boolean = true;
    url: string = '';
    phone: string = '';
    display_phone: string = '';
    review_count: number = 0;
    categories: any = [];
    rating: number = 1;
    location: any = {};
    coordinates: any;
    photos: any;
    price: string = '';
    hours: any;
    transactions: any;

    constructor() {
        this.location = new Location();
    }
}
