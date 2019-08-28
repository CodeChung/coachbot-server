BEGIN;

TRUNCATE
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, name, password)
VALUES
  ('demo', 'demo', '$2a$12$umpQ/YEwyYulDYC/71.DY.3PI5ghhgQE7hD69o7iOVYj9Ms9Zd6fK'),
  ('jimbo', 'Jimothy Jones', '$2a$12$34aLVL3/JbUtOVKRAXuHEubOvd.3rG9vhFNLe5U2gIrRI.kLi8tHa'),
  ('martwart', 'Martha Stewart', '$2a$12$34aLVL3/JbUtOVKRAXuHEubOvd.3rG9vhFNLe5U2gIrRI.kLi8tHa');

INSERT INTO users (id, username, name, password)
VALUES
  (0, 'coach', 'coach', 'coach');

INSERT INTO goals (title, last_logged, schedule, motivations, duration, user_id)
VALUES
  ('learn to drive', '2019-08-24 22:41:48.324556', '{"Fri": true, "Mon": true, "Sat": true, "Sun": true, "Thu": true, "Tue": true, "Wed": true}', null, 65, 1),
  ('work out', null, '{"Fri": true, "Mon": true, "Sat": false, "Sun": false, "Thu": true, "Tue": true, "Wed": true}', null, 42, 1),
  ('learn the piano', '2019-08-24 22:41:48.324556', '{"Fri": true, "Mon": false, "Sat": true, "Sun": true, "Thu": true, "Tue": true, "Wed": false}', null, 65, 2);

INSERT INTO goal_logs (date, notes, rating, goal_id) 
VALUES
  ('2019-07-26','{"notes": "it was ok; i almost crashed today"}', 3, 1),
  ('2019-07-27','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-07-28','{"notes": "it was great; i passed my test!!!!"}', 3, 1),
  ('2019-07-29','{"notes": "i failed my test, but i didnt crash"}', 4, 1),
  ('2019-07-30','{"notes": "it was ok; i almost crashed today"}', 5, 1),
  ('2019-07-31','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-01','{"notes": "it was ok; i almost crashed today"}', 7, 1),
  ('2019-08-02','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-03','{"notes": "it was great; i passed my test!!!!"}', 9, 1),
  ('2019-08-04','{"notes": "i failed my test, but i didnt crash"}', 1, 1),
  ('2019-08-05','{"notes": "it was ok; i almost crashed today"}', 2, 1),
  ('2019-08-06','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-07','{"notes": "it was great; i passed my test!!!!"}', 10, 1),
  ('2019-08-08','{"notes": "i failed my test, but i didnt crash"}', 4, 1),
  ('2019-08-09','{"notes": "it was ok; i almost crashed today"}', 6, 1),
  ('2019-08-10','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-11','{"notes": "it was great; i passed my test!!!!"}', 10, 1),
  ('2019-08-12','{"notes": "i failed my test, but i didnt crash"}', 4, 1),
  ('2019-08-13','{"notes": "it was ok; i almost crashed today"}', 6, 1),
  ('2019-08-14','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-15','{"notes": "it was great; i passed my test!!!!"}', 10, 1),
  ('2019-08-16','{"notes": "i failed my test, but i didnt crash"}', 4, 1),
  ('2019-08-17','{"notes": "it was ok; i almost crashed today"}', 6, 1),
  ('2019-08-18','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-19','{"notes": "it was great; i passed my test!!!!"}', 10, 1),
  ('2019-08-20','{"notes": "i failed my test, but i didnt crash"}', 4, 1),
  ('2019-08-21','{"notes": "it was ok; i almost crashed today"}', 6, 1),
  ('2019-08-22','{"notes": "it was bad; i crashed"}', 2, 1),
  ('2019-08-23','{"notes": "it was great; i passed my test!!!!"}', 10, 1),
  ('2019-08-24','{"notes": "i failed my test, but i didnt crash"}', 4, 1);

INSERT INTO conversations (date, goal_id)
VALUES
    ('2019-08-24', 1),
    ('2019-08-24', 2),
    ('2019-08-25', 1);

INSERT INTO messages (user_id, convo_id, message, date)
VALUES
    (0, 1, 'I see youre new here, Its me, your coach. Are you ready to get started?', '2019-08-25 20:41:59.369357'),
    (1, 1, 'yes', '2019-08-25 20:41:59.369357'),
    (0, 1, 'ok, lets get started', '2019-08-25 20:41:59.369359');

COMMIT;
