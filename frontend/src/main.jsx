import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx' 


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', 
  cache: new InMemoryCache(), 
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <App />
      </CartProvider>
    </ApolloProvider>
  </StrictMode>,
)