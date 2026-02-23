#!/bin/bash

# FIXME: if any of the types change due to your overlays then these changes will not be reflected here.
npx openapi-typescript ./openapi/oad/front.yaml -o ./src/types/front.d.ts
npx openapi-typescript ./openapi/oad/google-calendar.yaml -o ./src/types/google-calendar.d.ts
npx openapi-typescript openapi/oad/acube.yaml -o ./src/types/acube.d.ts
npx openapi-typescript openapi/oad/peppyrus.yaml -o ./src/types/peppyrus.d.ts
npx openapi-typescript openapi/oad/ion.yaml -o ./src/types/ion.d.ts
npx openapi-typescript openapi/oad/arratech.yaml -o ./src/types/arratech.d.ts
npx openapi-typescript openapi/oad/maventa.yaml -o ./src/types/maventa.d.ts
npx openapi-typescript openapi/oad/recommand.yaml -o ./src/types/recommand.d.ts
npx openapi-typescript openapi/oad/scrada.yaml -o ./src/types/scrada.d.ts
npx openapi-typescript openapi/oad/netfly.yaml -o ./src/types/netfly.d.ts
npx openapi-typescript openapi/oad/moneybird.yaml -o ./src/types/moneybird.d.ts
