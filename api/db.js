const Neode = require('neode');

const db = Neode.fromEnv();

db.model('Employee', {
  eid: {
    primary: true,
    type: 'uuid',
  },
  name: {
    type: 'name',
    indexed: true,
  }
});

db
.model('Employee')
.relationship('boss', 'relationship', 'BOSS', 'in', 'Employee');

db
.all('Employee')
.then(employees => {
  console.log(`Employee Count: ${employees.length}`);
  if (employees.length === 0) {
    // Seed DB
    Promise.all([
      db.create('Employee', {name: 'Root'}),
      db.create('Employee', {name: 'A'}),
      db.create('Employee', {name: 'B'}),
      db.create('Employee', {name: 'C'}),
      db.create('Employee', {name: 'D'}),
      db.create('Employee', {name: 'E'}),
    ])
    .then(([root, a, b, c, d, e]) => {
      return Promise.all([
        root.relateTo(a, 'boss'),
        root.relateTo(b, 'boss'),
        a.relateTo(c, 'boss'),
        a.relateTo(d, 'boss'),
        b.relateTo(e, 'boss'),
      ]);
    })
    .then(rels => console.log(`Seeded successfully.`))
    .catch(err => console.error(err));
  }
})
.catch(err => console.error(err));

module.exports = db;
