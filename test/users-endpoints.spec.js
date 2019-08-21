const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Users Endpoints', () => {
    let db

    const { testUsers } = helpers.makeFixtures()
    const testUser = testUsers[0]
    
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('POST /api/users', () => {
        context('User Validation', () => {
            beforeEach('insert users', () => {
                helpers.seedUsers(
                    db,
                    testUsers
                )
            })

            const requiredFields = ['username', 'password', 'name']

            requiredFields.forEach(field => {
                const registerUserBody = {
                    username: 'test username',
                    password: 'test password',
                    name: 'test name'
                }
                
                it(`responds with 400 error when ${field} is missing`, () => {
                    delete registerUserBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerUserBody)
                        .expect(400, {
                            error: `Missing ${field} in request body`
                        })
                })
            })

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    username: 'test username',
                    password: '1234567',
                    name: 'test name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })

            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    username: 'test username',
                    password: '*'.repeat(73),
                    name: 'test name',
                }
                // console.log(userLongPassword)
                // console.log(userLongPassword.password.length)
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be less than 72 characters` })
            })

            it(`responds 400 error when password starts with space`, () => {
                const userPasswordStartsSpaces = {
                    username: 'test username',
                    password: '  1Aa!2Bb@',
                    name: 'test name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: 'Password must not start or end with empty spaces' })
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordsEndsSpaces = {
                    username: 'test username',
                    password: '1Aa!2Bb@  ',
                    name: 'test name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordsEndsSpaces)
                    .expect(400, { error: 'Password must not start or end with empty spaces' })
            })

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    username: 'test username',
                    password: '11AAaabb',
                    name: 'test name',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error : 'Password must contain 1 upper case, lower case, number, and special character' })
            })

            it(`responds 400 'Username already taken' when username isn't unique`, () => {
                const duplicateUser = {
                    username: testUser.username,
                    password: '11AAaa!!',
                    name: 'test name',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, { error: 'Username already taken' })
            })
        })
    })
})