declare module "passport" {
    export function initialize();
    export function session();
    export function authenticate(opt: any, opt2?: any);
    export function serializeUser(opt: any);
    export function deserializeUser(opt: any);
    export function use(opt: any);
}

declare module "passport-flickr" {
    export function Strategy(option: any, callback: Function);
}
