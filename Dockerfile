FROM node:16.15.0-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV production
ENV PORT 3000

RUN yarn install --production

CMD ["npm", "start"]
EXPOSE 3000




