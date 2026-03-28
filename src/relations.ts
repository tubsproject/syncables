export async function resolveRelations(
  syncableNames: string[],
  relations: {
    [placeholder: string]: {
      collection: string,
      field: string,
      resolved?: string;
    }
  },
  data: {
    [url: string]: object[],
  },
  callback: (synableName: string, resolution: {
    [pattern: string]: string;
  }) => Promise<object[]>,
): Promise<{
    [url: string]: object[],
  }> {
  const resolution = {};
  // use the data to resolve relations:
  for (let i = 0; i < Object.keys(relations).length; i++) {
    const placeholder = Object.keys(relations)[i];
    const relation = relations[placeholder];
    if (typeof relation['resolved'] === 'undefined') {
      let dataFound: {
        [url: string]: object[],
      } = {};
      if (typeof data[relation.collection] === 'undefined') {
        continue;
      }
      const values: string[] = data[relation.collection].map(obj => obj[relation.field]);
      const promises = values.map(async (value) => {
        const relationsCopy = Object.assign({}, relations);
        relationsCopy[placeholder].resolved = value;
        const newData = await resolveRelations(
          syncableNames,
          relations,
          data,
          callback,
        );
        Object.entries(newData).forEach(([ key, value ]) => {
          dataFound[key] = value;
        })
      });
      await Promise.all(promises);
      return dataFound;
    } else {
      resolution[placeholder] = relation.resolved;
    }
  }
  return { [syncableNames[0]]: await callback(syncableNames[0], resolution) };


  //   if (relations[placeholder].length > 1) {
  //     let allItems: object[] = [];
  //     for (let j = 0; j < relations[placeholder].length; j++) {
  //       const singledOut = {};
  //       for (let k = 0; k < Object.keys(relations).length; k++) {
  //         if (k === i) {
  //           singledOut[placeholder] = [relations[placeholder][j]];
  //         } else {
  //           singledOut[Object.keys(relations)[k]] =
  //             relations[Object.keys(relations)[k]];
  //         }
  //       }
  //       console.log('singled out a combination of relations', singledOut);
  //       const itemsForThisParent = await resolveRelations(
  //         syncableName,
  //         relations,
  //         data,
  //         callback,
  //       );
  //       allItems = allItems.concat(itemsForThisParent);
  //     }
  //     return allItems;
  //   }
  // }
  // // if we reach here then all the parent patterns only have one value, so we can just fill those in and do one fetch
  // // we also fill in any parameters that might be hardcoded in spec.query, for instance a `{ format: '.json' }`
  // const theseParents: { [pattern: string]: string } = Object.assign(
  //   {},
  //   this.syncables[syncableName].spec.query || {},
  // );
  // Object.keys(relations).forEach((pattern) => {
  //   theseParents[pattern] = relations[pattern][0];
  // });
  // console.log('now we can call doOneFetch for syncable', syncableName, 'with theseParents', theseParents);

  // return await callback(syncableName, theseParents);
}
