export declare const respondToGets: (Gun: any, { disableRelay, skipValidation }?: {
    disableRelay?: boolean | undefined;
    skipValidation?: boolean | undefined;
}, lmdbOpts?: undefined) => (db: any) => any;
export declare const acceptWrites: (Gun: any, { disableRelay }?: {
    disableRelay?: boolean | undefined;
}, lmdbOpts?: undefined) => (db: any) => any;
