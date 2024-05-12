const express = require('express');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Enviar archivo HTML + ruta
});

app.get('/procesarimg', async (req, res) => {
  const imageUrl = req.query.imageUrl; 

  try {
    const image = await Jimp.read(imageUrl);
    const processedImage = await image
      .greyscale() 
      .resize(350, Jimp.AUTO); 

    
    const uuid = uuidv4().slice(0, 6); // Obtener los primeros 6 caracteres del UUID
    const processedImageName = `${uuid}.jpg`;

    // Guarda la imagen procesada
    await processedImage
      .quality(100) 
      .writeAsync(processedImageName); 
    console.log(`Imagen procesada con éxito y guardada como ${processedImageName}`);

    // Envía la imagen procesada como respuesta
    res.sendFile(__dirname + '/' + processedImageName);
  } catch (err) {
    console.error(err);
    res.send('Error, no se pudo procesar la imagen');
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
