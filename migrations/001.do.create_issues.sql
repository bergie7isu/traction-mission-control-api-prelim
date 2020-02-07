CREATE TABLE issues (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    issue TEXT NOT NULL,
    who TEXT NOT NULL,
    created TEXT NOT NULL,
    status TEXT,
    reviewed TEXT
);