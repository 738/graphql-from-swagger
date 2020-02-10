# graphql-from-swagger

<a href="http://badge.fury.io/js/graphql-from-swagger"><img src="https://badge.fury.io/js/graphql-from-swagger.svg"></a>

> 🍇 Swagger 하나로 GraphQL 관련 코드를 생성해주는 CLI입니다.

![demo](./example/demo.gif)

## 개요

간단한 설정 파일 하나와 명령어 하나로 Swagger를 통해 GraphQL 관련 코드를 생성해주는 CLI입니다.

### Input

* Swagger

### Output

* GraphQL Schema
* Schema Type Definition
* RESTDataSource(apollo-datasource-rest) Child Class
* GraphQL Resolvers

## CLI Usage

```bash
$ npx graphql-from-swagger
```

혹은

```bash
$ npm i -g graphql-from-swagger
$ graphql-from-swagger
```

## Config

프로젝트 루트 디렉토리에 `graphql-from-swagger.config.json` 파일을 생성합니다.

다음은 예시 설정 파일입니다.

```json
{
  "swaggerPaths": ["test/swagger.json", "https://petstore.swagger.io/v2/swagger.json"],
  "schemaOutputFiles": ["generated/heroes.graphql", "generated/petstore.graphql"],
  "typesOutputFiles": ["generated/HeroesTypes.ts", "generated/PetstoreTypes.ts"],
  "restDataSourceOutputFiles": ["generated/HeroesApi.ts", "generated/PetstoreApi.ts"],
  "resolversOutputFiles": ["generated/HeroesResolvers.ts", "generated/PetstoreResolvers.ts"]
}
```

설정을 위한 5가지 변수가 있습니다.

| field                     | type     | description                                                    | ext                 |
|---------------------------|----------|----------------------------------------------------------------|---------------------|
| swaggerPaths              | string[] | swagger.json 혹은 swagger.yaml 파일의 경로 혹은 url입니다.            | .json | .yaml | url |
| schemaOutputFiles         | string[] | swagger를 통해 생성될 GraphQL Schema 파일의 경로입니다.                | .graphql            |
| typesOutputFiles          | string[] | GraphQL Schema를 통해 생성될 Type Definition 파일의 경로입니다.        | .ts                 |
| restDataSourceOutputFiles | string[] | RESTDataSource(apollo-datasource-rest)의 자식클래스 파일의 경로입니다. | .ts                 |
| resolversOutputFiles      | string[] | 생성될 resolvers 파일의 경로입니다.                                  | .ts                 |

## Dependencies

* `swagger`를 통해 GraphQL Schema를 생성할 때 [`swagger-to-graphql`](https://github.com/yarax/swagger-to-graphql) 라이브러리를 사용합니다.
* GraphQL Schema를 통해 Typescript Type Definition 파일을 생성할 때 [`@graphql-codegen/typescript`](https://graphql-code-generator.com/docs/plugins/typescript) 라이브러리를 사용합니다.

## License

MIT
