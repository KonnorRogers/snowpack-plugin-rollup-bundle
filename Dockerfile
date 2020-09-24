FROM cypress/included:5.2.0

RUN chmod 755 /root
# point Cypress at the /root/cache no matter what user account is used
# see https://on.cypress.io/caching
ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress

ENV APP_DIR=/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY --chown=node package.json $APP_DIR
COPY --chown=node yarn.lock $APP_DIR

RUN yarn install

USER node

COPY --chown=node . .

CMD ["yarn", "test"]
