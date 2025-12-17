import express from 'express';
import { getLinks } from './scrapers.js';

const app = express();
const PORT = process.env.PORT || 7000;

// Addon manifest
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'org.stremio.beeclone',
        version: '1.0.0',
        name: 'BeeClone',
        description: 'BeeTV-style addon for public domain movies',
        resources: ['stream', 'meta', 'catalog'],
        types: ['movie'],
        catalogs: [{
            type: 'movie',
            id: 'publicdomain',
            name: 'Public Domain Movies'
        }]
    });
});

// Catalog endpoint
app.get('/catalog/:type/:id.json', async (req, res) => {
    const catalog = [
        { id: 'tt001', type: 'movie', name: 'Night of the Living Dead', poster: '', description: 'Classic zombie movie' },
        { id: 'tt002', type: 'movie', name: 'Plan 9 from Outer Space', poster: '', description: 'B-movie cult classic' },
        { id: 'tt003', type: 'movie', name: 'His Girl Friday', poster: '', description: 'Classic comedy film' }
    ];
    res.json({ metas: catalog });
});

// Stream endpoint
app.get('/stream/:type/:id.json', async (req, res) => {
    const titleMap = {
        'tt001': 'Night of the Living Dead',
        'tt002': 'Plan 9 from Outer Space',
        'tt003': 'His Girl Friday'
    };
    const streams = await getLinks(titleMap[req.params.id]);
    res.json({ streams });
});

// Metadata endpoint (optional)
app.get('/meta/:type/:id.json', async (req, res) => {
    const metaMap = {
        'tt001': { id: 'tt001', type: 'movie', name: 'Night of the Living Dead', poster: '', description: 'Classic zombie movie' },
        'tt002': { id: 'tt002', type: 'movie', name: 'Plan 9 from Outer Space', poster: '', description: 'B-movie cult classic' },
        'tt003': { id: 'tt003', type: 'movie', name: 'His Girl Friday', poster: '', description: 'Classic comedy film' }
    };
    res.json({ meta: metaMap[req.params.id] });
});

app.listen(PORT, () => console.log(`BeeClone running on port ${PORT}`));
