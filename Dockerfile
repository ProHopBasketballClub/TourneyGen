FROM node:latest
EXPOSE ${PORT}

COPY package.json package.json
RUN npm install
RUN mkdir -p web/backend
COPY web/backend/ web/backend

RUN npm run build:backend

CMD ["node", "web/backend/dist/"]
