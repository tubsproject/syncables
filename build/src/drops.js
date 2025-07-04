export function localizedDropToInternal(fromPlatform, from, identifierToInternal) {
    if (typeof from.model !== 'string') {
        console.log(from);
        throw new Error('localized drop does not have a model');
    }
    const ret = {
        tubsId: from.foreignIds['tubs'] || identifierToInternal(from.model, from.localId),
        platformIds: {},
        properties: {},
        relations: {},
        model: from.model,
    };
    Object.keys(from).forEach((field) => {
        if (typeof from[field] === 'undefined') {
            console.log(from);
            throw new Error(`localized drop has ${field} undefined`);
        }
        if (field === 'localId') {
            ret.platformIds[fromPlatform] = from[field];
        }
        else if (field === 'model') {
            ret.model = from[field];
        }
        else if (field === 'foreignIds') {
            Object.keys(from[field]).forEach((platform) => {
                if (typeof from[field][platform] === 'undefined') {
                    console.log(from);
                    throw new Error(`localized drop has ${field}.${platform} undefined`);
                }
                if (platform !== 'tubs') {
                    ret.platformIds[platform] = from[field][platform];
                }
            });
            // console.log('copied foreignIds into platformIds', from.foreignIds, ret.platformIds);
        }
        else if (field.endsWith('Id')) {
            const relation = field.substring(0, field.length - 'Id'.length);
            ret.relations[relation] = {
                model: relation,
                tubsId: identifierToInternal(relation, from[field]),
            };
        }
        else {
            ret.properties[field] = from[field];
        }
    });
    return ret;
}
export function internalDropToLocalized(toPlatform, from, identifierToLocal) {
    // console.log('finding localId', toPlatform, from.model, from.tubsId);
    // console.log('converting platformIds to foreignIds', from.platformIds);
    const ret = {
        localId: from.platformIds[toPlatform] ||
            identifierToLocal(from.model, from.tubsId),
        foreignIds: JSON.parse(JSON.stringify(from.platformIds)),
        model: from.model,
    };
    // console.log('found localId', toPlatform, from.model, from.tubsId, ret.localId);
    delete ret.foreignIds[toPlatform];
    ret.foreignIds.tubs = from.tubsId;
    Object.keys(from.properties).forEach((field) => {
        ret[field] = from.properties[field];
    });
    Object.keys(from.relations).forEach((relation) => {
        ret[`${relation}Id`] = identifierToLocal(relation, from.relations[relation].tubsId);
    });
    return ret;
}
//# sourceMappingURL=drops.js.map