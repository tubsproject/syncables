#!/bin/bash


# npx openapi-typescript ./openapi/oad/front.yaml -o ./src/types/front.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/google-calendar.yaml --overlay ./openapi/overlay/google-calendar-overlay.yaml > openapi/generated/google-calendar.yaml
# npx openapi-typescript ./openapi/generated/google-calendar.yaml -o ./src/types/google-calendar.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/acube-peppol.yaml --overlay ./openapi/overlay/acube-peppol-overlay.yaml > openapi/generated/acube.yaml
# npx openapi-typescript openapi/generated/acube.yaml -o ./src/types/acube.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/peppyrus-peppol.yaml --overlay ./openapi/overlay/peppyrus-peppol-overlay.yaml > openapi/generated/peppyrus.yaml
# npx openapi-typescript openapi/generated/peppyrus.yaml -o ./src/types/peppyrus.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/ion-peppol.yaml --overlay ./openapi/overlay/ion-peppol-overlay.yaml > openapi/generated/ion.yaml
# npx openapi-typescript openapi/generated/ion.yaml -o ./src/types/ion.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/arratech-peppol.json --overlay ./openapi/overlay/arratech-peppol-overlay.yaml > openapi/generated/arratech.yaml
# npx openapi-typescript openapi/generated/arratech.yaml -o ./src/types/arratech.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/maventa-peppol.yaml --overlay ./openapi/overlay/maventa-peppol-overlay.yaml > openapi/generated/maventa.yaml
# npx openapi-typescript openapi/generated/maventa.yaml -o ./src/types/maventa.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/recommand-peppol.yaml --overlay ./openapi/overlay/recommand-peppol-overlay.yaml > openapi/generated/recommand.yaml
# npx openapi-typescript openapi/generated/recommand.yaml -o ./src/types/recommand.d.ts
# ./node_modules/.bin/overlayjs --openapi ./openapi/oad/scrada-peppol.json --overlay ./openapi/overlay/scrada-peppol-overlay.yaml > openapi/generated/scrada.yaml
# npx openapi-typescript openapi/generated/scrada.yaml -o ./src/types/scrada.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/netfly-peppol.yaml --overlay ./openapi/overlay/netfly-peppol-overlay.yaml > openapi/generated/netfly.yaml
npx openapi-typescript openapi/generated/netfly.yaml -o ./src/types/netfly.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/moneybird.yaml --overlay ./openapi/overlay/moneybird-overlay.yaml > openapi/generated/moneybird.yaml
npx openapi-typescript openapi/generated/moneybird.yaml -o ./src/types/moneybird.d.ts
