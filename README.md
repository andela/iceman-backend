# Barefoot Nomad - Making company travel and accommodation easy and convenient.

[![Build Status](https://travis-ci.com/andela/iceman-backend.svg?branch=development)](https://travis-ci.com/andela/iceman-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/iceman-backend/badge.svg?branch=development)](https://coveralls.io/github/andela/iceman-backend?branch=development) [![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/56f831ea8261409ffb5f/maintainability)](https://codeclimate.com/github/andela/iceman-backend/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/56f831ea8261409ffb5f/test_coverage)](https://codeclimate.com/github/andela/iceman-backend/test_coverage)

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
docker run -p 3000:3000 <docker-image-name>
```
For example,
```
docker run -p 3000:3000 iceman-backend
```

## API Endpoints

<table>
<tr><th>HTTP VERB</th><th>ENDPOINTS</th><th>DESCRIPTION</th></tr>
<tr><td>POST</td><td>/api/v1/auth/signup</td><td>Creates user account</td></tr>
<tr><td>POST</td><td>/api/v1/auth/login</td><td>Logs user in</td></tr>
<tr><td>GET</td><td>/api/v1/users/profile</td><td>Gets user profile information</td></tr>
<tr><td>PATCH</td><td>/api/v1/users/profile</td><td>Updates user profile information</td></tr>
<tr><td>GET</td><td>/api/v1/auth/verify</td><td>Verify user email</td></tr>
<tr><td>GET</td><td>/api/v1/auth/resend_verification_link</td><td>Resend verification link</td></tr>
<tr><td>POST</td><td>/api/v1/auth/forgot_password</td><td>Send password reset token</td></tr>
<tr><td>PATCH</td><td>/api/v1/auth/reset_password/:token</td><td>Reset user password</td></tr>
<tr><td>GET</td><td>/api/v1/auth/facebook</td><td>Authenticate user using Facebook</td></tr>
<tr><td>GET</td><td>/api/v1/auth/google</td><td>Authenticate user using Google</td></tr>
<tr><td>PATCH</td><td>/api/v1/auth/assign_role</td><td>Assign user role</td></tr>
<tr><td>POST</td><td>/api/v1/requests/multi-city</td><td>Allow user to make multi city request</td></tr>
<tr><td>POST</td><td>/api/v1/requests/one-way</td><td>Allow user to make one way request</td></tr>
<tr><td>POST</td><td>/api/v1/requests/return</td><td>Create a return trip</td></tr>
<tr><td>PATCH</td><td>/api/v1/requests/:id</td><td>Updates trip requests</td></tr>
<tr><td>GET</td><td>/api/v1/requests</td><td>Retrieve user requests</td></tr>
<tr><td>GET</td><td>/api/v1/requests/return</td><td>Create a return trip</td></tr>
<tr><td>GET</td><td>/api/v1/requests/pending</td><td>Avail open requests for approval</td></tr>
<tr><td>PATCH</td><td>/api/v1/requests/:id/respond</td><td>Approve or Reject a travel request</td></tr>
</table>

## API Documentation
The documentation of this API can currently be found [here](https://iceman-backend-staging.herokuapp.com/docs/)
