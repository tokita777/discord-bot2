const axios = require('axios');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'abracar',
    description: 'Abraça um usuário mencionado.',
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) {
            return message.channel.send('Você precisa mencionar alguém para abraçar.');
        }

        try {
            const response = await axios.get('https://nekos.life/api/v2/img/hug'); // Endpoint para pegar GIF de abraço
            const gifUrl = response.data.url; // URL do GIF

            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle(`${message.author.username} abraçou ${user.username}!`)
                .setDescription('Que calor humano! 🤗')
                .setImage(gifUrl)
                .setTimestamp();

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('abracar_revidar')
                        .setLabel('Revidar')
                        .setStyle(ButtonStyle.Primary)
                );

            await message.channel.send({ embeds: [embed], components: [buttonRow] });
        } catch (error) {
            console.error(error);
            message.channel.send('Não consegui encontrar um GIF para você.');
        }
    },
};
