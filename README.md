[![Build Status](https://travis-ci.com/andela/iceman-backend.svg?branch=development)](https://travis-ci.com/andela/iceman-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/iceman-backend/badge.svg?branch=development)](https://coveralls.io/github/andela/iceman-backend?branch=development) [![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/56f831ea8261409ffb5f/maintainability)](https://codeclimate.com/github/andela/iceman-backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/56f831ea8261409ffb5f/test_coverage)](https://codeclimate.com/github/andela/iceman-backend/test_coverage)

Barefoot Nomad - Making company travel and accommodation easy and convenient.

## Vision

Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

## EditorConfig Setup
This project uses a `.editorconfig` file to help maintain consistent coding styles for the developers working on this project across various editors and IDEs. Follow [this link to see if your editor requires a plugin for this feature and to guide you in installing the required plugin if it does](https://editorconfig.org/#download).

## Installation and Usage with Docker
To install and run the app with Docker, you must have Docker installed and running on your computer. Follow this [link to guide you in installing and setting up Docker on Windows 10, MacOS or Linux](https://docs.docker.com/install/). Then clone this repo and run this command to build the Docker image.
```
docker build -t <docker-image-name> .
```
Where `<docker-image-name>` is the name you choose to give to the Docker image. For example,
```
docker build -t iceman-backend .
```
After the build process has been completed, run this command to run the app from the Docker image.
```
docker run <docker-image-name>
```
For example,
```
docker run iceman-backend
```
