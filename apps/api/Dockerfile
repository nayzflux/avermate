FROM oven/bun:1 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lockb bun.lockb
COPY /apps/api/package.json ./apps/api/package.json

RUN bun install


COPY . .

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile api \
	--sourcemap \
	--bytecode \
	./apps/api/src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/api api

ENV NODE_ENV=production

EXPOSE 5000/tcp

CMD ["./api"]