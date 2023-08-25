export interface Distinction {
    name: string
}

export interface Context extends Distinction {
    predicates: Predicate[]
}

export interface Document extends Distinction {

}
export interface Definition extends Distinction {
    text: string
}

export interface Agent extends Distinction {

}

export interface Person extends Agent {

}

export interface Institution extends Agent {

}

export interface Place extends Distinction {{

}

export interface Address extends Place {
    adress1: string
    address2: string
    city: string
    state: string
    zip: string
    country: string
}

export interface ContactInfo extends Distinction {
    Addresses: Map<string, Address>
    Emails: Map<string, string>
    PhoneNumbers: Map<string, string>
    Urls: Map<string, Url>
    SocialMedia: Map<string, string>
}

export interface Url extends Distinction {

}
