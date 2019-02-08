module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, res) {
    return { hello: 'Emmanuel' }
  })
}
