export async function resolveRelations(
  syncableName: string,
  parents: {
    [pattern: string]: string[];
  },
  callback: (synableName: string, parents: {
    [pattern: string]: string;
  }) => Promise<object[]>,
): Promise<object[]> {
  for (let i = 0; i < Object.keys(parents).length; i++) {
    const pattern = Object.keys(parents)[i];
    if (parents[pattern].length > 1) {
      let allItems: object[] = [];
      for (let j = 0; j < parents[pattern].length; j++) {
        const singledOut = {};
        for (let k = 0; k < Object.keys(parents).length; k++) {
          if (k === i) {
            singledOut[pattern] = [parents[pattern][j]];
          } else {
            singledOut[Object.keys(parents)[k]] =
              parents[Object.keys(parents)[k]];
          }
        }
        console.log('singled out a combination of parents', singledOut);
        const itemsForThisParent = await resolveRelations(
          syncableName,
          singledOut,
          callback,
        );
        allItems = allItems.concat(itemsForThisParent);
      }
      return allItems;
    }
  }
  // if we reach here then all the parent patterns only have one value, so we can just fill those in and do one fetch
  // we also fill in any parameters that might be hardcoded in spec.query, for instance a `{ format: '.json' }`
  const theseParents: { [pattern: string]: string } = Object.assign(
    {},
    this.syncables[syncableName].spec.query || {},
  );
  Object.keys(parents).forEach((pattern) => {
    theseParents[pattern] = parents[pattern][0];
  });
  console.log('now we can call doOneFetch for syncable', syncableName, 'with theseParents', theseParents);

  return await callback(syncableName, theseParents);
}
