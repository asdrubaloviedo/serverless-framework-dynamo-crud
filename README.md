## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Levantamiento](#levantamiento)
3. [Tests](#test)
4. [Layers](#layers)
5. [CI/CD](#ci/cd)
6. [Contenido](#contenido)
7. [Autores](#autores)

## Instalación

```bash
npm install
```

## Levantamiento

Levantamiento local

```bash
serverless deploy
```

## Test

Pruebas locales

```bash
npm run test
```

## Layers

Estos comandos crearan los directorios necesarios para las lambda layers

```
npm i --omit=dev
mkdir nodejs/
mv node_modules/ nodejs/
zip -r nodejs-layer.zip nodejs/
rm -rf nodejs/
```

Estos comandos subiran las lambda layers a AWS, luego podremos verlas en Lambda -> Additional resourses -> Layers

```
aws lambda publish-layer-version --layer-name my-first-layer \
--description "My first layer for lambda with nodejs" \
--license-info "MIT" \
--zip-file fileb://nodejs-layer.zip \
--compatible-runtimes nodejs18.x \
--compatible-architectures x86_64 \
```

## CI/CD

Esto instalara las dependencias, construira la app, ejecutara los test y hara el deploy a AWS

```bash
git push -u origin master
```

## Contenido

serverless framework, AWS(lambda, api-gateway, S3), CI/CD(GitHub Actions), Jest

## Autores

Asdrúbal Oviedo
