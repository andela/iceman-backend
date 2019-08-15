Barefoot Nomad - Making company travel and accommodation easy and convenient.
=======

## Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

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
