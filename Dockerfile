FROM alpine:3.24.4 AS base
WORKDIR /app


FROM oven/bun:slim AS frontend
WORKDIR /KoopFeedback.Frondend

COPY /KoopFeedback.Frondend/package.json /KoopFeedback.Frondend/package.json

RUN bun install

COPY /KoopFeedback.Frondend/ /KoopFeedback.Frondend/

RUN bun run build

FROM golang:alpine3.24 AS backend
WORKDIR /KoopFeedback.Backend

COPY /KoopFeedback.Backend/go.mod /KoopFeedback.Backend/go.mod
COPY /KoopFeedback.Backend/go.sum /KoopFeedback.Backend/go.sum

RUN go mod download

COPY /KoopFeedback.Backend /KoopFeedback.Backend

RUN go build cmd/main.go

FROM base AS final
WORKDIR /app

ENV FRONTEND_BUILD=/app/KoopFeedback.Frondend
ENV API_URL=""

COPY --from=backend /KoopFeedback.Backend/main /app/KoopFeedback.Backend/koopfeedback
COPY --from=frontend /KoopFeedback.Frondend/build/ /app/KoopFeedback.Frondend/

CMD ["/app/KoopFeedback.Backend/koopfeedback"]