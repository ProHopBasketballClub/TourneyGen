FROM node:latest
ARG dbConnectionString=undefined
ENV PORT 3001
ENV DB_CONNECTION_STRING ${dbConnectionString}}
EXPOSE 3001

COPY package.json package.json
RUN npm install
Run mkdir -p web/backend
COPY web/backend/ web/backend

RUN npm run build:backend

CMD ["node", "web/backend/dist/"]
