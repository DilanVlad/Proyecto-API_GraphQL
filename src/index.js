import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefs = mergeTypeDefs(
    loadFilesSync('./src/type-system/*.graphql')
);

const resolvers = mergeResolvers(
    loadFilesSync('./src/resolvers/*.js')
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

import jwt from 'jsonwebtoken';

const SECRET_KEY = 'secret_key_alquileres_graphql_jwt';

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        const auth = req.headers.authorization || '';
        if (auth.startsWith('Bearer ')) {
            const token = auth.substring(7);
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return { user };
            } catch (err) {
                return {};
            }
        }
        return {};
    }
});
console.log(`🚀 Server ready at ${url}`);