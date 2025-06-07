const db = require('../db');

async function getAllEvents(filters={}) {
  const { category, location, date } = filters;
  const cond = [], vals = [];
  if (category) { vals.push(category); cond.push(`category ILIKE $${vals.length}`); }
  if (location) { vals.push(location); cond.push(`location ILIKE $${vals.length}`); }
  if (date) { vals.push(date); cond.push(`DATE(date_time) = $${vals.length}`); }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  return db.query(`
    SELECT id,title,date_time AS "dateTime",
           location,category,description,image_url AS "imageUrl"
    FROM events ${where} ORDER BY date_time ASC`, vals);
}

async function getEventById(id) {
  return db.query(
    'SELECT id,title,date_time AS "dateTime",location,category,description,image_url AS "imageUrl" FROM events WHERE id=$1',
    [id]
  );
}

async function createEvent({ title, dateTime, location, category, description, imageUrl }) {
  return db.query(
    `INSERT INTO events(title,date_time,location,category,description,image_url)
     VALUES($1,$2,$3,$4,$5,$6)
     RETURNING id,title,date_time AS "dateTime",location,category,description,image_url AS "imageUrl"`,
    [title, dateTime, location, category, description, imageUrl]
  );
}

async function updateEvent(id, { title, dateTime, location, category, description, imageUrl }) {
  return db.query(
    `UPDATE events SET
        title=$1,date_time=$2,location=$3,category=$4,description=$5,
        image_url=COALESCE($6,image_url),updated_at=NOW()
     WHERE id=$7
     RETURNING id,title,date_time AS "dateTime",location,category,description,image_url AS "imageUrl"`,
    [title, dateTime, location, category, description, imageUrl, id]
  );
}

async function deleteEvent(id) {
  return db.query('DELETE FROM events WHERE id=$1', [id]);
}

async function insertBulkEvents(events) {
  return db.transaction(async client => {
    const values = events.map(e => [e.title,e.date_time,e.location,e.category,e.description||null,e.image_url||null]);
    const placeholders = values.map((_,i) =>
      `($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`
    ).join(',');
    const flat = values.flat();
    const { rows } = await client.query(`
      INSERT INTO events(title,date_time,location,category,description,image_url)
      VALUES ${placeholders} RETURNING *`, flat);
    return rows;
  });
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  insertBulkEvents
};
