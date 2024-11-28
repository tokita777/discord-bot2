const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'gif',
    description: 'Procura por um GIF de anime.',
    async execute(message, args) {
        const searchTerm = args.join(' ');
        if (!searchTerm) {
            return message.channel.send('Você precisa fornecer um termo de busca para o GIF.');
        }

        try {
            const apiKey = '1721NHekIOelajzLQATtc4Tdqgqsl2pM';  // Substitua com sua chave da Giphy
            const response = await axios.get(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(searchTerm)}&api_key=${apiKey}&limit=1`);
            const gifUrl = response.data.data[0].images.original.url;

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`Aqui está o GIF que encontrei para "${searchTerm}"`)
                .setImage(gifUrl)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao procurar um GIF.');
        }
    },
};
