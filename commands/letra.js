const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'letra',
    description: 'Busca a letra de uma música usando Genius API',
    async execute(message, args) {
        if (args.length < 1) {
            return message.reply('Por favor, informe o nome da música.');
        }

        const query = args.join(' ');

        try {
            const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    Authorization: `Bearer ${process.env.GENIUS_TOKEN}`
                }
            });

            if (response.data.response.hits.length === 0) {
                return message.reply('Não encontrei resultados para essa música.');
            }

            const song = response.data.response.hits[0].result;
            const embed = new EmbedBuilder()
                .setColor('#ffce00')
                .setTitle(song.full_title)
                .setURL(song.url)
                .setThumbnail(song.song_art_image_thumbnail_url)
                .setDescription('Clique no título para ver a letra completa no Genius!');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Ocorreu um erro ao buscar a música.');
        }
    },
};
