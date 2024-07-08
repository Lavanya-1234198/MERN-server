const express = require('express');
const router = express.Router();
const { ApolloServer, gql } = require('apollo-server-express');
const User = require('../model/userSchema'); // Adjust the path as needed
const typeDefs=require('../schema')
const resolvers=require('../resolvers')
const server = new ApolloServer({ typeDefs, resolvers });

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { data, errors } = await server.executeOperation({
            query: gql`
                mutation {
                    createUser(input: { name: "${name}", email: "${email}", password: "${password}" }) {
                        id
                        name
                        email
                        password
                    }
                }
            `,
        });

        if (errors) {
            return res.status(500).send({ message: errors });
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, errors } = await server.executeOperation({
            query: gql`
                mutation loginUser($email: String!, $password: String!) {
                    loginUser(email: $email, password: $password) {
                        id
                        name
                        email
                    }
                }
            `,
            variables: { email, password }
        });

        if (errors) {
            return res.status(500).send(errors);
        }

        const user = data.loginUser;
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/logout', async (req, res) => {
    try {
    res.status(200).send({ message: 'Logged out successfully' });
    } catch (err) {
    res.status(500).send({ message: err.message });
    }
    });

module.exports = router;
