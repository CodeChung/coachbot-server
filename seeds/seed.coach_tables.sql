BEGIN;

TRUNCATE
  blogful_comments,
  blogful_articles,
  blogful_users
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, name, password)
VALUES
  ('demo', 'demo', '$2a$12$umpQ/YEwyYulDYC/71.DY.3PI5ghhgQE7hD69o7iOVYj9Ms9Zd6fK'),
  ('jimbo', 'Jimothy Jones', '$2a$12$34aLVL3/JbUtOVKRAXuHEubOvd.3rG9vhFNLe5U2gIrRI.kLi8tHa'),
  ('martwart', 'Martha Stewart', 'fnraeinbiu4h3ubfufirds!@#@!W');

INSERT INTO goals (title, last_logged, schedule, motivations, duration, user_id)
VALUES
  ('learn to drive', '2019-08-24 22:41:48.324556', '{"Fri": true, "Mon": false, "Sat": true, "Sun": true, "Thu": true, "Tue": true, "Wed": false}', null, 65, 1),
  ('work out', null, '{"Fri": true, "Mon": true, "Sat": false, "Sun": false, "Thu": true, "Tue": true, "Wed": true}', null, 42, 1)
  ('learn the piano', '2019-08-24 22:41:48.324556', '{"Fri": true, "Mon": false, "Sat": true, "Sun": true, "Thu": true, "Tue": true, "Wed": false}', null, 65, 2);

INSERT INTO goal_logs (date, notes, rating, goal_id) 
VALUES
  ()
  ()
  ()

INSERT INTO conversations (date, goal_id)
VALUES
    ('2019-08-24', 1),
    ('2019-08-24', 2),
    ('2019-08-25', 1);

INSERT INTO messages (user_id, convo_id, message, date)
VALUES
    ()

COMMIT;
