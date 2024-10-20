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
            const response = await axios.get('https://nekos.life/api/v2/img/neko'); // Aqui estamos usando um exemplo com 'neko'
            const gifUrl = response.data.url; // URL da imagem

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
