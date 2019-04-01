/*
    Requiring packages that we will 
    need for this tutorial
*/
import '@babel/polyfill'
import { users, todos } from './mock'
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

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

app.post('/create-account', (req, res) => {
    //
})

/*
    Starting the app
*/
app.listen(port, () =>
    console.log(
        `🔥🔥🔥 GraphQL + Express auth tutorial listening on port ${port}!`,
    ),
)
