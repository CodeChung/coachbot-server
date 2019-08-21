const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'bobby',
            name: 'bobby boucher',
            password: 'bouche'
        },
        {
            id: 2,
            username: 'timbo',
            name: 'timmy turner',
            password: 'timothy'
        },
        {
            id: 3,
            username: 'big_shiela',
            name: 'shiela jones',
            password: 'password'
        }
    ]
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            users RESTART IDENTITY CASCADE
        `
    )
}


function makeFixtures() {
    const testUsers = makeUsersArray()

    return { testUsers, }
}

function seedUsers(db, users) {
    const bcryptUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    
    return db.into('users').insert(bcryptUsers)
        .then(() => {})
}

module.exports = {
    makeUsersArray,
    makeFixtures,
    cleanTables,
    seedUsers,
}