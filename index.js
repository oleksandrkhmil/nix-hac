const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    console.log(req.body)
    res.send('Hello world!')
});

app.get('/move', (req, res) => {
    const { field, narrowingIn, gameId } = req.body;

    console.log(field)
    console.log(narrowingIn)
    console.log(gameId)

    console.log(req.body)

    res.send('Hello world!')
});

app.get('/healthz', (req, res) => {
    console.log(req.body)
    res.send({status: 'OK'})
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
