FROM cypress/browsers:node12.8.1-chrome80-ff72

RUN mkdir -p /app
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install
COPY . .
