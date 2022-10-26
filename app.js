const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://indonesia.go.id/profil/kementerian_lembaga')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('.news-box .table > tbody > tr').each(function(i, elem) {
                    data[i] = {
                        name: $(elem).find('.headkab').text(),
                        category: $(elem).find('td:nth-child(4)').text(),
                        image: $(elem).find('img').attr('src'),
                        url: $(elem).find('td:nth-child(5) a').attr('href')
                    }
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});