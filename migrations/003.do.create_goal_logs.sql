CREATE TABLE goal_logs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    notes jsonb,
    rating INTEGER,
    goal_id INTEGER
        REFERENCES goals(id) ON DELETE CASCADE NOT NULL
)
