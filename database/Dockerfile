FROM postgres:12.4

# Set the locale
RUN sed -i -e 's/# es_AR.UTF-8 UTF-8/es_AR.UTF-8 UTF-8/' /etc/locale.gen && \
  locale-gen
ENV LANG es_AR.UTF-8
ENV LANGUAGE es_AR:es
ENV LC_ALL es_AR.UTF-8
