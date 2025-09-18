const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

if (!PRIVATE_APP_ACCESS) {
    console.warn('Warning: HUBSPOT_TOKEN no está configurado.');
}

const hubspot = axios.create({
    baseURL: 'https://api.hubapi.com',
    headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
});

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.


function propertiesQuery(props) {
    return props && props.length ? `properties=${props.join('&properties=')}` : '';
}

app.get('/', async (req, res) => {
    try {
        const defaultProperties = ['nombre', 'sexo', 'edad'];

        const propsQuery = propertiesQuery(defaultProperties);

        const url = `/crm/v3/objects/p_pets?limit=100&${propsQuery}`;
        const resp = await hubspot.get(url);

        res.render('homepage', { title: 'homepage', pets: resp.data.results || [] });
    } catch (err) {
        console.error('Error fetching pets:', err?.response?.data || err.message);
        res.status(500).send('Error fetching pets. Revisa la consola del servidor.');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));