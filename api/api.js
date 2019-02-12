const fastify = require('fastify')();
const utils = require('./utils');
const db = require('./db');

fastify.register(
  require('fastify-cors'), {
    origin: /.*/,
    methods: ['GET', 'POST'],
  })

fastify.get('/:name', async (req, res) => {
  const name = req.params.name || 'Root';
  console.log(`Name: ${name}`);
  const query = `
    MATCH (b:Employee {name: {name}})
    MATCH p = shortestPath( (b)<-[:BOSS*0..]-(e) )
    UNWIND nodes(p) as n
    UNWIND relationships(p) as r
    RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as paths
  `;
  return await db
  .cypher(query, {name})
  .then(res => {
    return utils.extract(res);
  })
  .catch(err => {
    console.log(err);
    return {message: err.message};
  });
});

fastify.get('/move/:child/:parent', async (req, res) => {
  const {child, parent} = req.params;
  console.log(`Moving: ${child} to ${parent}`);
  const query = `
    MATCH (p:Employee {name: {parent}})
    MATCH (:Employee)<-[rel:BOSS]-(emp:Employee {name: {child}})
    WITH p, rel, emp
    CREATE (p)<-[:BOSS]-(emp)
    DELETE rel
  `;
  return await db
  .cypher(query, {child, parent})
  .then(() => ({message: `Moved: ${child} to ${parent}`}))
  .catch(err => {
    console.log(err);
    return {message: err.message};
  });
});

fastify.post('/move', async (req, res) => {
  console.log(req.body);
  return {message: req.body};
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
