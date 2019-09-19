FROM node:latest
ARG dbConnectionString=undefined
ARG port=undefined
ENV PORT ${port}
ENV DB_CONNECTION_STRING ${dbConnectionString}}
EXPOSE ${port}

COPY package.json package.json
RUN npm install
Run mkdir -p web/backend
COPY web/backend/ web/backend

RUN npm run build:backend

CMD ["node", "web/backend/dist/"]
