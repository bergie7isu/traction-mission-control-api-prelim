TRUNCATE todos, issues, team RESTART IDENTITY CASCADE;

INSERT INTO issues (issue, who, created, status, reviewed)
VALUES
  ('First issue', 'Mark Bergstrom', '2019-01-03', null, 'no'),
  ('Second issue', 'Paul Johnson', '2019-02-03', null, 'no'),
  ('Third issue', 'Joel Tjepkes', '2019-03-03', null, 'no'),
  ('Fourth issue', 'Steve Thor', '2019-04-03', null, 'no'),
  ('Fifth issue', 'Nathan Witt', '2019-05-03', null, 'no'),
  ('Sixth issue', 'Mark Bergstrom', '2019-06-03', 'Solved', 'yes'),
  ('Seventh issue', 'Paul Johnson', '2019-07-03', 'Killed', 'yes'),
  ('Eighth issue', 'Joel Tjepkes', '2019-08-03', 'Combined', 'yes'),
  ('Ninth issue', 'Steve Thor', '2019-09-03', 'Solved', 'yes'),
  ('Tenth issue', 'Nathan Witt', '2019-10-03', 'Killed', 'yes'),
  ('Eleventh issue', 'Mark Bergstom', '2019-11-03', null, 'no');

INSERT INTO todos (todo, who, created, due, status, reviewed, issue)
VALUES
  ('First todo', 'Mark Bergstrom', '2019-01-03', '2019-01-10', null, 'no', 1),
  ('Second todo', 'Paul Johnson', '2019-02-03', '2019-02-10', null, 'no', 2),
  ('Third todo', 'Joel Tjepkes', '2019-03-03', '2019-03-10', null, 'no', 3),
  ('Fourth todo', 'Steve Thor', '2019-04-03', '2019-04-10', null, 'no', 4),
  ('Fifth todo', 'Nathan Witt', '2019-05-03', '2019-05-10', null, 'no', 5),
  ('Sixth todo', 'Mark Bergstrom', '2019-06-03', '2019-06-10', 'Done', 'yes', 6),
  ('Seventh todo', 'Paul Johnson', '2019-07-03', '2019-07-10', 'Not Done', 'yes', 7),
  ('Eighth todo', 'Joel Tjepkes', '2019-08-03', '2019-08-10', 'Done', 'yes', 8),
  ('Ninth todo', 'Steve Thor', '2019-09-03', '2019-09-10', 'Not Done', 'yes', 9),
  ('Tenth todo', 'Nathan Witt', '2019-10-03', '2019-10-10', 'Done', 'yes', 10),
  ('Eleventh todo', 'Mark Bergstrom', '2019-11-03', '2019-11-10', 'Not Done', 'yes', 11);

INSERT INTO team (name)
VALUES
  ('Mark Bergstrom'),
  ('Paul Johnson'),
  ('Bob Olson'),
  ('Steve Thor'),
  ('Joel Tjepkes'),
  ('Nathan Witt');