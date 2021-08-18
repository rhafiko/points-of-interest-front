# Points of Interest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Description

This is the App `Points of Interest` which allows users to mark/edit their points of interest on a map. Users can use the app to share their Points of Interest with each other.

Users need to create an account and sign in to have access to the map and start to do mark Points of Interest.

**About Limitations** and what changes would need to be considered to scale to 100, 1 000, and 100 000 concurrent users:
- As the solution uses JWT tokens, it is ready for scale as microservice. 
- In order to support the load and concurrent users, it may be necessary to review the database connection pool.
- The app is mobile-friendly but, needs some enhancements, like the use of device GPS to trace routes, receive push notifications when a new place is shared. As it isn't a native/hybrid solution, have some limitations about hardware features access.

### See it running at Heroku

- [Points Of Interest](https://points-of-interest-frontend.herokuapp.com)
- https://points-of-interest-frontend.herokuapp.com


## Installation

```bash
$ npm install

```

## Running the app
```bash
Run `npm run start:dev` for a dev server consuming the remote API running locally. 
src/environment
  environment.ts

Run `ng run start:prod` for a dev server consuming the remote API on Heroku.
src/environment
  environment.prod.ts
```

Then navigate to `http://localhost:4200/`

## Next Features

1. Rate the locals using stars. For rates from 1 to 2 stars force comment.
2. Add comments and photos, allowing users to share their impressions about it.
3. Show top-rated places near my location, with the option to sort by most recent, top-rated, etc.
4. Share local and Allow other users to view it by using of @userName
5. Change local visibility by toggle public/private or shared, viewing its attributes as owner, rate, and users comments.
6. Bookmark local as preferred and provide quick access to these lists
7. Search places by a distance range
8. Group places when zoomed out.
9. Add tags/categories of places like “next travel, stay away, cozy, etc”
10. Trace a new route to the select place
11. Config users profile to add photo
12. Option on users profile to make all places as public/private by default
13. User full name and email
14. Password change/recover option
