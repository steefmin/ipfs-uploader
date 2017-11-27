FROM node

ENV NPM_CONFIG_LOGLEVEL warn

# Install wrtc dependencies (node)
RUN apt-get update -qqy && \
    apt-get install -y libasound2

# Install wrtc dependencies (node:slim)
RUN apt-get update -qqy && \
    apt-get install -y --no-install-recommends python-minimal make libasound2

# Install wrtc dependencies (node:alpine)
RUN apk update && \
    apk add alsa-lib
