import { v7 } from 'css-authn';
export async function getFetcher() {
    // console.log('obtaining authenticated fetcher', process.env);
    const authenticatedFetch = await v7.getAuthenticatedFetch({
        email: process.env.SOLID_EMAIL,
        password: process.env.SOLID_PASSWORD,
        provider: process.env.SOLID_SERVER,
    });
    // console.log('obtained authenticated fetcher');
    return (...args) => {
        console.log('fetching', args[0]);
        return authenticatedFetch.apply(this, args);
    };
}
//# sourceMappingURL=fetcher.js.map