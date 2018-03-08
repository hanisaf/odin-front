#!/bin/bash
sed "s/build = \".*\"/build = \"$(date)\"/" src/app/data.ts > data.ts
mv data.ts src/app/data.ts
ng build -prod
rm dist.zip
zip -r dist dist
