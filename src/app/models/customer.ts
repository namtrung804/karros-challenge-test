import {CustomerAddress} from './customer-address';

export class Customer {
    id = -1;
    first_name: string = '';
    last_name: string = '';
    phone: number;
    email: string = '';
    created_at: string = '';
    note: string = '';
    tags: any = [];
    "accept_marketing": boolean = false;
    "tax_exempt": boolean = false;
    last_order_id: number;
    last_order_name: string = '';
    order_count = 0;
    total_spent: string = '';
    addresses: any = [];
    default_address: any;
    constructor() {
        this.addresses.push(new CustomerAddress());
        this.default_address = new CustomerAddress();
    }
}
