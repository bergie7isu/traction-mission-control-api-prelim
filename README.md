# Traction Mission Control
Drive accountability.
Get more done.
Grow your business!

## Live App:
https://traction-mission-control-app.now.sh/

## Summary:
The Traction Mission Control App is your go-to tool for driving accountability, follow-through, and consistent communication in your organization running on the EOS Platform.

#### To-dos:
Document action items in your L-10 Meetings and drive team accountability to complete tasks on-time, everytime. Link to-dos directly to the issues they solve, and track completion performance right in the app! When everyone gets their tasks done, the team wins!

#### Issues:
We've all got issues. Keeping track of them in your L-10 Meeting and solving them forever can be hard. Let Traction Mission Control help!

#### Archive Filtering:
Quickly view and filter archived to-dos and issues for yourself and your team. View historical performance data to drive accountability discussions.

## Screenshots:
![Screenshot of To-do List](/src/images/screenshots/todos-screenshot.JPG?raw=true "To-do List")
![Screenshot of Issues List](/src/images/screenshots/issues-screenshot.JPG?raw=true "Issues List")
![Screenshot of Archive](/src/images/screenshots/archive-screenshot.JPG?raw=true "Archive Filtering")

## Technologies Used:
React, CSS, Node, Express, PostgreSQL

## API Documentation:

#### Todo Object Example
```javascript
{
    "id": 1,
    "todo": "First to-do",
    "who": "John Doe",
    "created": "2020-02-11",
    "due": "2020-02-18",
    "status": "Not Done",
    "status_date": "2020-02-18",
    "reviewed": "yes",
    "issue": 2
}
```

#### Issue Object Example
```javascript
{
    "id": 3,
    "issue": "Third issue",
    "who": "Jane Doe",
    "created": "2020-02-11",
    "status": "Solved",
    "status_date": "2020-02-18",
    "reviewed": "no"
},
```

#### `/api/todos`

##### Methods:
`GET` - returns a list of all todos\
`POST` - adds a new todo

##### Required Parameters:
`GET` - none\
`POST` - todo, who, created, due, reviewed

#### `/api/todos/:id`

##### Methods:
`GET` - returns a specific todo\
`DELETE` - removes a specific todo\
`PATCH` - updates a specific todo

##### Required Parameters:
`GET` - id\
`DELETE` - id\
`PATCH` - one of: todo, who, due, issue

#### `/api/issues`

##### Methods:
`GET` - returns a list of all issues\
`POST` - adds a new issue

##### Required Parameters:
`GET` - none\
`POST` - issue, who, created, reviewed

#### `/api/issues/:id`

##### Methods:
`GET` - returns a specific issue\
`DELETE` - removes a specific issue\
`PATCH` - updates a specific issue

##### Required Parameters:
`GET` - id\
`DELETE` - id\
`PATCH` - one of: issue, who