// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.BASE_URL }),
    endpoints: (builder) => ({

        // ----------------   Get data  ------------------
        getPokemonByName: builder.query({
            query: (name) => `pokemon/${name}`,
        }),

        // ----------------   create data  ------------------
        createPokemon: builder.mutation({
            query: (newPokemon) => ({
                url: 'pokemon', // The URL where you want to post the new Pokémon
                method: 'POST',
                body: newPokemon, // The body of the request, should be the data you want to send
            }),
        }),

        // ----------------   update data  ------------------
        updatePokemon: builder.mutation({
            query: ({ name, patch }) => ({
              url: `pokemon/${name}`,
              // When performing a mutation, you typically use a method of
              // PATCH/PUT/POST/DELETE for REST endpoints
              method: 'PATCH',
              // fetchBaseQuery automatically adds `content-type: application/json` to
              // the Headers and calls `JSON.stringify(patch)`
              body: patch,
            }),
          }),

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery, useCreatePokemonMutation } = pokemonApi