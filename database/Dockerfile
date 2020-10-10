FROM postgres:12.4

# Copy scripts to run on container startup
COPY ./scripts/ /docker-entrypoint-initdb.d/

# Set the locale
RUN sed -i -e 's/# es_AR.UTF-8 UTF-8/es_AR.UTF-8 UTF-8/' /etc/locale.gen && \
  locale-gen
ENV LANG es_AR.UTF-8
ENV LANGUAGE es_AR:es
ENV LC_ALL es_AR.UTF-8
