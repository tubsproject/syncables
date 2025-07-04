export async function fetchTracker(uri, authenticatedFetcher) {
    const ret = await authenticatedFetcher(uri, {
        headers: {
            Accept: 'application/ld+json',
        },
    });
    const data = await ret.json();
    console.log(data);
}
//# sourceMappingURL=tasks.js.map