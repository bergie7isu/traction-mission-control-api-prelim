TRUNCATE todos, issues, team RESTART IDENTITY CASCADE;

INSERT INTO issues (issue, who, created, status, status_date, reviewed)
VALUES
  ('First issue', 'Mark Bergstrom', '2019-01-03', null, null, 'no'),
  ('Second issue', 'Paul Johnson', '2019-02-03', null, null, 'no'),
  ('Third issue', 'Joel Tjepkes', '2019-03-03', null, null, 'no'),
  ('Fourth issue', 'Steve Thor', '2019-04-03', null, null, 'no'),
  ('Fifth issue', 'Nathan Witt', '2019-05-03', null, null, 'no'),
  ('Sixth issue', 'Mark Bergstrom', '2019-06-03', 'Solved', '2019-06-10', 'yes'),
  ('Seventh issue', 'Paul Johnson', '2019-07-03', 'Killed', '2019-07-10', 'yes'),
  ('Eighth issue', 'Joel Tjepkes', '2019-08-03', 'Combined', '2019-08-10', 'yes'),
  ('Ninth issue', 'Steve Thor', '2019-09-03', 'Solved', '2019-09-10', 'yes'),
  ('Tenth issue', 'Nathan Witt', '2019-10-03', 'Killed', '2019-10-10', 'yes'),
  ('Eleventh issue', 'Mark Bergstrom', '2019-11-03', null, null, 'no');

INSERT INTO todos (todo, who, created, due, status, status_date, reviewed, issue)
VALUES
  ('First to-do', 'Mark Bergstrom', '2019-01-03', '2019-01-10', null, null, 'no', 1),
  ('Second to-do', 'Paul Johnson', '2019-02-03', '2019-02-10', null, null, 'no', 2),
  ('Third to-do', 'Joel Tjepkes', '2019-03-03', '2019-03-10', null, null, 'no', 3),
  ('Fourth to-do', 'Steve Thor', '2019-04-03', '2019-04-10', null, null, 'no', null),
  ('Fifth to-do', 'Nathan Witt', '2019-05-03', '2019-05-10', null, null, 'no', null),
  ('Sixth to-do', 'Mark Bergstrom', '2019-06-03', '2019-06-10', 'Done', '2019-06-10', 'yes', 6),
  ('Seventh to-do', 'Paul Johnson', '2019-07-03', '2019-07-10', 'Not Done', '2019-07-10', 'yes', 7),
  ('Eighth to-do', 'Joel Tjepkes', '2019-08-03', '2019-08-10', 'Done', '2019-08-10', 'yes', 8),
  ('Ninth to-do', 'Steve Thor', '2019-09-03', '2019-09-10', 'Not Done', '2019-09-10', 'yes', 9),
  ('Tenth to-do', 'Nathan Witt', '2019-10-03', '2019-10-10', 'Done', '2019-10-10', 'yes', 10),
  ('Eleventh to-do', 'Mark Bergstrom', '2019-11-03', '2019-11-10', 'Not Done', '2019-11-10', 'yes', 11);

INSERT INTO team (name)
VALUES
  ('Mark Bergstrom'),
  ('Paul Johnson'),
  ('Bob Olson'),
  ('Steve Thor'),
  ('Joel Tjepkes'),
  ('Nathan Witt');