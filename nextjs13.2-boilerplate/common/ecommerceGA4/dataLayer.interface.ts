export interface IBaseItem {
    item_id: string
    item_name: string
    price?: number
    quantity?: number
    affiliation?: string
    coupon?:string
    discount?: number
}


// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_item

export interface IViewItem {
    currency: string
    value: number
    items: IBaseItem[]
}


// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase

export interface IPurchase {
    currency: string
    value: number
    transaction_id: string
    items: IBaseItem[]
}

// https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#begin_checkout

export interface IBeginCheckout {
    currency: string
    value: number
    coupon?: string
    items: IBaseItem[]
}
