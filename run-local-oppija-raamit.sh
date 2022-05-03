#!/bin/bash
npm run build
docker build . -t oppija-raamit-nginx
docker run -p 8079:80 --rm --name oppija-raamit-nginx-local -it oppija-raamit-nginx
