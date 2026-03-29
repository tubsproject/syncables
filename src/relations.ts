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
  level: number = 0,
): Promise<{
    [url: string]: object[],
  }> {
  const resolution = {};
  let dataFound: {
    [url: string]: object[],
  } = {};
  // console.log(`entering level ${level}`, relations);
  for (let i = 0; i < Object.keys(relations).length; i++) {
    const placeholder = Object.keys(relations)[i];
    // console.log(`looking at ${placeholder} at level ${level}`);
    const relation = relations[placeholder];
    if (typeof relation['resolved'] === 'undefined') {
      // console.log(placeholder, `not resolved yet at level ${level}`);
      if (typeof data[relation.collection] === 'undefined') {
        // console.log(`no data yet for ${placeholder} at level ${level}`);
        continue;
      }
      // console.log(`${placeholder} not resolved but have data at level ${level}`);
      const values: string[] = data[relation.collection].map(obj => obj[relation.field]);
      const promises = values.map(async (value) => {
        // console.log('dealing with valuation', value);
        const relationsCopy = Object.assign({}, relations);
        relationsCopy[placeholder].resolved = value;
        const relationsCopyStr = JSON.stringify(relationsCopy, null, 2);
        // console.log('recursion', syncableNames, relationsCopyStr);
        const newData = await resolveRelations(
          syncableNames,
          relationsCopy,
          data,
          callback,
          level + 1,
        );
        // console.log('new data', relationsCopyStr, newData);
        Object.entries(newData).forEach(([ key, value ]) => {
          dataFound[key] = (dataFound[key] || []).concat(value);
        })
      });
      await Promise.all(promises);
    } else {
      // console.log('filling in resolution from resolved', placeholder, relation.resolved);
      resolution[placeholder] = relation.resolved;
    }
  }
  for (let i = 0; i < syncableNames.length; i++) {
    if (data[syncableNames[i]]) {
      // console.log(`Already have data for ${syncableNames[i]}`);
      continue;
    }
    const placeholders = [];
    syncableNames[i].split('{').forEach(substr => {
      const parts = substr.split('}');
      if (parts.length === 2) {
        placeholders.push(parts[0]);
      }
    });
    let ok = true;
    placeholders.forEach(placeholder => {
      if (typeof resolution[placeholder] === 'undefined') {
        // console.log('no resolution for', placeholder);
        ok = false;
      }
    });
    if (!ok) {
      continue;
    }
    // console.log(`calling callback for ${syncableNames[i]} at level ${level}`, syncableNames[i]);
    const dataFoundHere = await callback(syncableNames[i], resolution);
    // console.log('callback gave', dataFoundHere);
    dataFound[syncableNames[i]] = (dataFound[syncableNames[i]] || []).concat(dataFoundHere);
  }
  // console.log(`returning data found at level ${level}`, dataFound);
  return dataFound;


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
