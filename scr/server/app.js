// importaciones
import express from 'express'
import fs from 'fs'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT ?? 3000

// configuraciones del servidor
app.use(cors())
app.use(express.json())
// permite leer la carpeta public
app.use(express.static('public'))

// enviando la informacion hasta el usuario para completar la lista
app.get('/canciones', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json'))
    res.status(200).json(canciones)
  } catch (error) {
    res.status(404).send(error.message)
  }
})

app.post('/canciones', (req, res) => {
  try {
    // evitar que se agregen canciones sin campos completados
    const { id, titulo, artista, tono } = req.body
    if (titulo === '' || artista === '' || tono === '') {
      throw new Error('Se deben completar todos los campos')
    }
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json'))
    // revisando que exista la cancion.
    const ExisteLaCancion = canciones.findIndex(cancion => cancion.id === id)
    if (ExisteLaCancion >= 0) {
      throw new Error('ID repetido')
    }
    const cancion = req.body
    canciones.push(cancion)
    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2), 'utf8')
    res.send('cancion agregada con exito')
  } catch (error) {
    res.status(400).send(`Error al cargar ${error.message}`)
  }
})

app.put('/canciones/:id', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json'))
    const { titulo, artista, tono } = req.body
    const cancion = req.body
    const index = canciones.findIndex(c => req.params.id === `${c.id}`)
    // revisando si existe la cancion.
    if (index === -1) { res.status(404).send('la cancion no existe') }
    // no se podra editar si no esta todos los campos completados
    if (titulo === '' || artista === '' || tono === '') { throw new Error('Se deben completar todos los campos') }
    if (index !== -1) {
      canciones[index] = cancion
      fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2), 'utf8')
      res.status(200).send('cancion editada con exito')
    }
  } catch (error) {
    res.status(400).send(`Error al editar la cancion ${error.message}`)
  }
})

app.delete('/canciones/:id', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json'))
    const index = canciones.findIndex(c => req.params.id === `${c.id}`)
    // revisando si existe la cancion.
    if (index === -1) { res.status(404).send('la cancion no existe') }
    if (index !== -1) {
      canciones.splice(index, 1)
      fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2), 'utf8')
      res.status(200).send('cancion eliminada con exito')
    }
  } catch (error) {
    res.status(400).send(`Error al eliminar la cancion ${error.message}`)
  }
})

app.listen(PORT, () => console.log('Servidor UP'))
