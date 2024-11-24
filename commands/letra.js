const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'letra',
    description: 'Busca a letra de uma música',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Por favor, informe o nome do artista e da música.');
        }

        const artist = args[0];
        const song = args.slice(1).join(' ');

        try {
            const response = await axios.get(`https://lyricsovh.vercel.app/v1/${artist}/${song}`);
            const lyrics = response.data.lyrics;

            if (!lyrics) {
                return message.reply('Desculpe, não encontramos a letra dessa música.');
            }

            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle(`Letra da música: ${song}`)
                .setDescription(lyrics.length > 4096 ? lyrics.slice(0, 4093) + '...' : lyrics)
                .setFooter({ text: `Solicitado por ${message.author.tag}` });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Ocorreu um erro ao buscar a letra.');
        }
    },
};
