const express = require('express')
const fs = require('fs/promises')
const yaml = require('js-yaml')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
app.use(express.json())
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(cors());

const filePath = './component.yml'

app.get('/template', async (req, res) => {
    const file = await fs.readFile(filePath, 'utf8')
    if (file) {
        const component = yaml.load(file)
        return res.json({
            template: component.template,
            styles: component.styles
        })
    }
    res.status(500).send('Ошибка чтения файла')
})

app.get('/data', async (req, res) => {
    const file = await fs.readFile(filePath, 'utf8')
    if (file) {
        const component = yaml.load(file)
        return res.json(component.data)
    }
    res.status(500).send('Ошибка чтения файла')
})

app.post('/data', async (req, res) => {
    const file = await fs.readFile(filePath, 'utf8')
    if (file) {
        const component = yaml.load(file)
        component.template = req.body.template || component.template
        component.styles = req.body.styles || component.styles
        await fs.writeFile(filePath, yaml.dump(component).toString())
    }
    res.status(200)
})

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000')
})
