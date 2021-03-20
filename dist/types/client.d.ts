export interface GunNode {
    _: {
        '#': string;
        '>': {
            [key: string]: number;
        };
        [key: string]: any;
    };
    [key: string]: any;
}
export interface GunPut {
    [soul: string]: GunNode;
}
export declare class GunLmdbClient {
    Gun: any;
    env: any;
    dbi: any;
    constructor(Gun: any, lmdbConfig?: {
        path: string;
    });
    get(soul: string): Promise<any>;
    getRaw(soul: string): Promise<any>;
    read(soul: string): Promise<any>;
    serialize(node: GunNode): string;
    deserialize(data: string): any;
    writeNode(soul: string, nodeData: GunNode): Promise<void>;
    write(put: GunPut): Promise<void>;
    close(): void;
}
export declare function createClient(Gun: any, options: any): GunLmdbClient;
