FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx playwright install-deps
RUN npx playwright install
COPY . .
CMD ["node", "index.js"]