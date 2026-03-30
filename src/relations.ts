import { TypedObject } from './schemaStore.js';

function getPlaceholders(str: string): string[] {
  const placeholders = [];
  str.split('{').forEach((substr) => {
    const parts = substr.split('}');
    if (parts.length === 2) {
      placeholders.push(parts[0]);
    }
  });
  return placeholders;
}

export async function resolveRelations(
  syncableNames: string[],
  input: {
    [placeholder: string]:
      | string
      | {
          collection?: string;
          field?: string;
          resolved?: string;
        };
  },
  data: {
    [url: string]: TypedObject;
  },
  callback: (
    synableName: string,
    resolution: {
      [pattern: string]: string;
    },
  ) => Promise<TypedObject>,
  level: number = 0,
): Promise<{
  [url: string]: TypedObject;
}> {
  const relations = {} as {
    [placeholder: string]: {
      collection?: string;
      field?: string;
      resolved?: string;
    };
  };
  console.log('relations input', input);
  Object.keys(input).forEach((placeholder) => {
    if (typeof input[placeholder] === 'string') {
      const parts = input[placeholder].split('#');
      if (parts.length !== 2) {
        relations[placeholder] = {
          resolved: input[placeholder],
        };
      }
      relations[placeholder] = {
        collection: parts[0],
        field: parts[1],
      };
    } else {
      relations[placeholder] = input[placeholder];
    }
  });
  const resolution = {};
  const dataFound: {
    [url: string]: TypedObject;
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
      // console.log(`${placeholder} not resolved but have data at level ${level}`, relations, data);
      const values: string[] = (data[relation.collection].data as object[])
        .filter((obj) => {
          const placeholders = getPlaceholders(relation.collection);
          let ok = true;
          placeholders.forEach((placeholder) => {
            if (
              typeof obj[placeholder] !== 'undefined' &&
              typeof relations[placeholder].resolved !== 'undefined'
            ) {
              // console.log(`filtering data on ${placeholder}`, obj[placeholder], relations[placeholder].resolved);
              if (obj[placeholder] !== relations[placeholder].resolved) {
                ok = false;
              }
            }
            // console.log('filtered', ok);
          });
          return ok;
        })
        .map((obj) => obj[relation.field]);
      const promises = values.map(async (value) => {
        // console.log('dealing with valuation', value);
        const relationsCopy = Object.assign({}, relations);
        relationsCopy[placeholder].resolved = value;
        // const relationsCopyStr = JSON.stringify(relationsCopy, null, 2);
        // console.log('recursion', syncableNames, relationsCopyStr);
        const newData = await resolveRelations(
          syncableNames,
          relationsCopy,
          data,
          callback,
          level + 1,
        );
        // console.log('new data', relationsCopyStr, newData);
        Object.entries(newData).forEach(([key, value]) => {
          dataFound[key] = {
            data: ((dataFound[key].data as object[]) || []).concat(value),
            schema: dataFound[key].schema,
          };
        });
      });
      await Promise.all(promises);
    } else {
      resolution[placeholder] = relation.resolved;
      // console.log(`filled in resolution for ${placeholder} from resolved ${relation.resolved} at level ${level}`, resolution);
    }
  }
  for (let i = 0; i < syncableNames.length; i++) {
    if (data[syncableNames[i]]) {
      // console.log(`Already have data for ${syncableNames[i]}`);
      continue;
    }
    const placeholders = getPlaceholders(syncableNames[i]);
    let ok = true;
    placeholders.forEach((placeholder) => {
      if (typeof resolution[placeholder] === 'undefined') {
        // console.log('no resolution for', placeholder);
        ok = false;
      }
    });
    if (!ok) {
      continue;
    }
    const dataFoundHere = await callback(syncableNames[i], resolution);
    // console.log(`callback for ${syncableNames[i]} for`, resolution, `at level ${level} gave`, dataFoundHere, `concatinating to`, dataFound[syncableNames[i]]);
    dataFound[syncableNames[i]] = {
      data: ((dataFound[syncableNames[i]]?.data as object[]) || []).concat(
        dataFoundHere,
      ),
      schema: dataFound[syncableNames[i]]?.schema,
    };
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
