const fastify = require('fastify')();
const uuidv4 = require('uuid/v4');
const utils = require('./utils');
const db = require('./db');

fastify.register(
  require('fastify-cors'), {
    origin: /localhost/,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'],
    headers: ['Content-Type', 'Origin', 'X-Requested-With'],
  }
);

fastify.get('/employees', async (req, res) => {
  // Returns the org. chart as a collection of nodes and edges.
  console.log('Root!');
  const query = `
    MATCH (b:Employee {name: 'Root'})
    MATCH p = shortestPath( (b)<-[:BOSS*0..]-(e) )
    UNWIND nodes(p) as n
    UNWIND relationships(p) as r
    RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as paths
  `;
  return await db
    .cypher(query)
    .then(res => {
      return utils.extract(res);
    })
    .catch(err => {
      console.log(err);
      return {error: err.message};
    });
});

fastify.post('/employees', async (req, res) => {
  // Adds a new employee the org. chart.
  const {name, boss} = req.body;
  const eid = uuidv4();
  console.log(`Adding: ${name} under ${boss}`);
  const query = `
    MATCH (p:Employee {eid: {boss}})
    WITH p
    CREATE (emp:Employee {eid: {eid}, name: {name}})
    CREATE (p)<-[:BOSS]-(emp)
  `;
  return await db
    .cypher(query, {eid, name, boss})
    .then(() => ({message: `Created: ${name} (${eid}) under ${boss}`}))
    .catch(err => {
      console.log(err);
      return {error: err.message};
    });
});

fastify.get('/employees/:eid', async (req, res) => {
  const eid = req.params.eid;
  console.log(`EID: ${eid}`);
  const query = `
    MATCH (b:Employee {eid: {eid}})
    MATCH p = shortestPath( (b)<-[:BOSS*0..]-(e) )
    UNWIND nodes(p) as n
    UNWIND relationships(p) as r
    RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as paths
  `;
  return await db
  .cypher(query, {eid})
  .then(res => {
    return utils.extract(res);
  })
  .catch(err => {
    console.log(err);
    return {error: err.message};
  });
});

fastify.put('/employees/:eid', async (req, res) => {
  const {eid} = req.params;
  const {parent} = req.body;
  console.log(`Moving: ${eid} to ${parent}`);
  const query = `
    MATCH (p:Employee {eid: {parent}})
    MATCH (:Employee)<-[rel:BOSS]-(emp:Employee {eid: {eid}})
    WITH p, rel, emp
    CREATE (p)<-[:BOSS]-(emp)
    DELETE rel
  `;
  return await db
  .cypher(query, {eid, parent})
  .then(() => ({message: `Moved: ${eid} to ${parent}`}))
  .catch(err => {
    console.log(err);
    return {error: err.message};
  });
});

const start = async () => {
  try {
    await fastify.listen(3031, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();
