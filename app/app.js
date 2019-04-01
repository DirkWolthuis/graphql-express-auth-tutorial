import '@babel/polyfill'
import { users, todos } from './mock'
const express = require('express')
const app = express()
const port = 3000
const { ApolloServer, gql } = require('apollo-server-express')

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

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })

app.listen(port, () =>
    console.log(
        `🔥🔥🔥 GraphQL + Express auth tutorial listening on port ${port}!`,
    ),
)
