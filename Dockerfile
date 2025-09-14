FROM node:20-alpine
WORKDIR /usr/src/app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# copy app
COPY . .

EXPOSE 3005

ENV NODE_ENV=production
CMD ["node", "index.js"]
