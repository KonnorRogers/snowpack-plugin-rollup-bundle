FROM cypress/base

EXPOSE 8080
EXPOSE 4000

# This is to fix an issue on Linux with permissions issues
ENV DOCKER_USER_ID=${DOCKER_USER_ID:-1000}
ENV DOCKER_GROUP_ID=${DOCKER_GROUP_ID:-1000}
ENV APP_DIR=${APP_DIR:-/home/user/app}
ENV CI=1

# Create a non-root user
RUN groupadd --gid $DOCKER_GROUP_ID user || true
RUN useradd --no-log-init \
            --uid $DOCKER_USER_ID \
            --gid $DOCKER_GROUP_ID \
            user --create-home || useradd --no-log-init user --create-home

# Permissions crap
RUN mkdir -p $APP_DIR/pkg
RUN chown -R $DOCKER_USER_ID:$DOCKER_GROUP_ID $APP_DIR
WORKDIR $APP_DIR

# for node_modules
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID package.json $APP_DIR
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID yarn.lock $APP_DIR

RUN yarn install
RUN yarn cypress install

# Define the user running the container
USER $DOCKER_USER_ID:$DOCKER_GROUP_ID

# Copy over all files
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID . $APP_DIR

RUN yarn build
RUN yarn cypress verify

CMD ["yarn", "test"]
