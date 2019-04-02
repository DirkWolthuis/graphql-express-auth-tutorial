/*
    Requiring packages that we will 
    need for this tutorial
*/
import '@babel/polyfill'
import { users, todos } from './mock'
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/*
    Some constants
*/
const SECRET_KEY =
    'DPEZTPUaBiu5qUigB-hfAnR7U004i4UrfYPelwJ5Pfasdq5IaWZXKVl0lF-nbzCKs2bDTpbexhEJAmCdBMvZBuWrexdp89pLqzpZ_yOgdSY_3qd8WIjSMBpfqMCH52c8bLDpCL1NT_GcfcmA5UE052Qda-nBz8eOMcGeCBwfOCRNNXduRnwiOMEYgG-ZvKTwC7HP_jEC2zMN3ztL7yKKl4BT84qJfQd4fq280pqxZ5k6wQIdJ4xaugU96tNLdnL93FNosE80aVF1RI_DkbmLl0HaYjSZurEbsMWcDyXhp3iNr30IavqBhgA5pz257MLfFIT7FaRRAYbEUriAZijbYQ'

/*
    Creating the Express instance
*/

const app = express()
const port = 3000

/*
    Adding middleware to Express
    This is necessary to get the post
    data from the request and to 
    access the API from a different 
    host 
*/

app.use(bodyParser.json())
app.use(cors())

/*
   Defining the schema's for GraphQL
   These are the type definitions
*/

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
    }

    type Todo {
        id: ID!
        user: String!
        name: String!
        description: String
    }

    type Query {
        todos: [Todo]
        todo(id: ID!): Todo
        users: [User]
        user(id: ID!): User
    }
`

/*
    Defining the resolvers for GraphQL
    Those resolver functions 'resolve' 
    the query into data, in a real 
    app you would access a database
    inside the resolvers
*/

export const resolvers = {
    Query: {
        todos: (root, args) => {
            return todos
        },
        todo: (root, { id }) => {
            return todos.find(todo => todo.id === id)
        },
        users: (root, args) => {
            return users
        },
        user: (root, { id }) => {
            return users.find(user => user.id === id)
        },
    },
}

/*
    Creating the Apollo server
*/

const server = new ApolloServer({ typeDefs, resolvers })

/*
    Creating a link between Express and Apollo
*/

server.applyMiddleware({ app })

/*
    Express routes/endpoints
*/

app.post('/get-token', async (req, res) => {
    const { email, password } = req.body
    const user = users.find(user => user.email === email)
    if (user) {
        //we use bcrypt to compare the hash in the database (mock.js) to the password the user provides
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            //we create the JWT for the user with our secret
            //inside the token we encrypt some user data
            //then we send the token to the user
            const token = jwt.sign(
                { email: user.email, id: user.id },
                SECRET_KEY,
            )

            res.send({
                success: true,
                token: token,
            })
        } else {
            //return error to user to let them know the password is incorrect
            res.status(401).send({
                success: false,
                message: 'Incorrect credentials',
            })
        }
    } else {
        //return error to user to let them know the account there are using does not exists
        res.status(404).send({
            success: false,
            message: `Could not find account: ${email}`,
        })
    }
})

/*
    Starting the app
*/
app.listen(port, () =>
    console.log(
        `🔥🔥🔥 GraphQL + Express auth tutorial listening on port ${port}!`,
    ),
)
