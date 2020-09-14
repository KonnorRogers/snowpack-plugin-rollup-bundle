FROM node:12-slim as builder

RUN apt update && apt install \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb && \
    rm -rf /var/lib/apt/lists/*


FROM builder as app

EXPOSE 8080
EXPOSE 4000

# This is to fix an issue on Linux with permissions issues
ENV DOCKER_USER_ID=${DOCKER_USER_ID:-1000}
ENV DOCKER_GROUP_ID=${DOCKER_GROUP_ID:-1000}
ENV APP_DIR=${APP_DIR:-/home/user/app}

# Create a non-root user
RUN groupadd --gid $DOCKER_GROUP_ID user
RUN useradd --no-log-init \
            --uid $DOCKER_USER_ID \
            --gid $DOCKER_GROUP_ID \
            user --create-home

# Permissions crap
RUN mkdir -p $APP_DIR
RUN chown -R $DOCKER_USER_ID:$DOCKER_GROUP_ID $APP_DIR

# Define the user running the container
USER $DOCKER_USER_ID:$DOCKER_GROUP_ID

# for node_modules
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID package.json $APP_DIR
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID yarn.lock $APP_DIR

RUN yarn install

# Copy over all files
COPY --chown=$DOCKER_USER_ID:$DOCKER_GROUP_ID . .

CMD ["yarn", "test"]
