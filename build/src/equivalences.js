export function equivalencesToLocalEquivalences(eq, platform) {
    const ret = {};
    Object.keys(eq).forEach((model) => {
        ret[model] = {};
        eq[model].forEach((map) => {
            const localId = map[platform];
            if (typeof localId !== 'undefined') {
                const filteredMap = JSON.parse(JSON.stringify(map));
                delete filteredMap[platform];
                ret[model][localId] = filteredMap;
            }
        });
    });
    return ret;
}
//# sourceMappingURL=equivalences.js.map