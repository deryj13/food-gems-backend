# Food Gems

## Link to Front End Repo
https://github.com/deryj13/food-gems-client

## Deployed URL

## Technologies Used
- Javascript
- Express
- MongoDB
- Mongoose
- Node.js

## Planning

My approach to this project was to first create my restaurant resource. After I
created the restaurant resource I would test it with the CRUD actions. Once I
confirm that I can successfuly perform all the CRUD actions, I created a csv
file with a list of all viable restaurant that are recommended by Phantom
Gourmet. After that, I created my review resource, in order to enable users to
leave reviews to the restaurants they've visited. The review resource was
also tested with CRUD methods. I created a psuedo relationship between
Restaurants and reviews where a restaurant can have many reviews and would
populate if there were any.

## Development Process
The development process went exactly as I planned which you could reference
up above.  One of the challenges I encountered was seeding a database using
Express and finding the code to customize in order to parse my csv file and
load that restaurant information to its database.


## Unsolved Problems
No unsolved problems, but future features I'd like to impliment.

## Future Features

I would like for the user to have access to an index of restaurants that they
consider to be gems based off their reviews.  In the future I can add a
favorites resource that would serve as a list of gems,where the user can add a
restaurant they like.

## Entity Relationship Diagram
![food-gems-ERD](https://i.imgur.com/J8Me91R.jpg)
