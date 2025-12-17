import fetch from 'node-fetch';
import cheerio from 'cheerio';

// Legal public domain movies from Archive.org
export async function getLinks(title) {
    const searchUrl = `https://archive.org/details/movies?query=${encodeURIComponent(title)}`;
    const html = await fetch(searchUrl).then(r => r.text());
    const $ = cheerio.load(html);

    const streams = [];

    $('.item-ia').each((i, elem) => {
        const name = $(elem).find('.ttl a').text();
        const videoPage = 'https://archive.org' + $(elem).find('.ttl a').attr('href');
        const videoUrl = $(elem).find('a[title="MP4"]').attr('href');

        if (videoUrl) {
            streams.push({
                title: name,
                url: videoUrl.startsWith('http') ? videoUrl : `https://archive.org${videoUrl}`,
                quality: '480p',
                subtitle: []
            });
        }
    });

    return streams.slice(0, 5); // limit to 5 links
}
