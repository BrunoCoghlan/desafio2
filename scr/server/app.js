import express from 'express'
const app = express()
const PORT = process.env.PORT ?? 3000

app.get('/canciones', (req, res) => { })

app.post('/canciones', (req, res) => { })

app.put('/canciones', (req, res) => { })

app.delete('/canciones', (req, res) => { })

app.listen(PORT, () => console.log('Servidor UP'))
